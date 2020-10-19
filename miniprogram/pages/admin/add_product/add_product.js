// miniprogram/pages/admin/add_product/add_product.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionList:['零食区'],
    collectionIndex:0,
    productName:'',
    imgList:[],
    l_guige:'',
    l_danwei:'',
    l_region_price:'',
    l_price:'',
    p_guige:'',
    p_danwei:'',
    p_region_price:'',
    p_price:'',
    fileID1:'',
    fileID2:'',
    fileID3:'',
    tempFileURL1:'',
    tempFileURL2:'',
    tempFileURL3:'',
    isSubmit:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCollections()
  },
  deleteimg(e){
    var that=this
    wx.showModal({
      title:'删除提示',
      content:'确定删除该商品照片吗？',
      cancelColor: '#ccc',
      confirmColor:'#1296db',
      success(res){
        if(res.confirm){
          let imgList=that.data.imgList
          console.log(e.currentTarget.dataset.index)
          imgList.splice(e.currentTarget.dataset.index,1)
          console.log(imgList)
          that.setData({
            imgList:imgList
          })
        }
      }
    })
  },
  addimg(){
    var that=this
    if(that.data.imgList.length===3){
      wx.showToast({
        title: '商品最多上传三张照片',
        icon:'none'
      })
      return
    }
    wx.chooseImage({
      count: 1,	
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
      //选择完成会先返回一个临时地址保存备用
        const tempFilePaths = res.tempFilePaths[0]
        let imgList=that.data.imgList
        imgList.push(tempFilePaths)
        that.setData({
          imgList:imgList
        })
        console.log(imgList)
      }
    })
  },
  l_guige(e){
    this.setData({
      l_guige:e.detail.value.trim()
    })
  },

  l_danwei(e){
    this.setData({
      l_danwei:e.detail.value.trim()
    })
  },

  l_region_price(e){
    this.setData({
      l_region_price:e.detail.value
    })
  },
  l_price(e){
    this.setData({
      l_price:e.detail.value
    })
  },
  p_guige(e){
    this.setData({
      p_guige:e.detail.value
    })
  },
  p_danwei(e){
    this.setData({
      p_danwei:e.detail.value.trim()
    })
  },
  p_region_price(e){
    this.setData({
      p_region_price:e.detail.value
    })
  },
  p_price(e){
    this.setData({
      p_price:e.detail.value
    })
  },
  productName(e){
    this.setData({
      productName:e.detail.value.trim()
    })
  },
  getProductArea(e){
    this.setData({
      collectionIndex:e.detail.value,
    })
  },

  getCollections(){
    var that=this
    wx.showLoading({
      title: '加载中',
      icon:'none'
    })
    wx.cloud.callFunction({
      name:'get_collections',
      data:{
        access_token:wx.getStorageSync('access_token'),
        env:app.globalData.env,
        limit:1000
      },
      success(res){
        if(res.result.errcode===42001 || res.result.errcode===40001 || res.result.errcode===41001){
          wx.cloud.callFunction({
            name:'access_token',
            success(res){
              wx.setStorageSync('access_token', JSON.parse(res.result).access_token)
              that.getCollections()
            },
            fail(err){
              console.log(err)
            }
          })
        }
        console.log(res)
        wx.hideLoading({
          complete: (res) => {},
        })
        if(res.result.collections.length){
          let collectionList=[]
          console.log(res.result.collections)
          res.result.collections.filter(s=>s.name!=='Users' && s.name!=='Advices').forEach(el => {
            collectionList.push(app.tohanzi(el.name))
          });
          that.setData({
            collectionList:collectionList
          })
          console.log(collectionList)
          if(!collectionList.length){
            wx.showToast({
              title: '请添加货架',
              icon:'none'
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1,
              })
            },1500)
          }
        }
      },
      fail(err){
        wx.hideLoading({
          complete: (res) => {},
        })
        console.log(err)
      }
    })
  },
  submit(){
    var that=this
    var formatArr= [
      {key:'p_price',msg:'批发价格'},
      // {key:'p_region_price',msg:'批发原价'} ,
      {key:'p_danwei',msg:'批发单位'} ,
      // {key:'p_guige',msg:'批发规格'} ,
      {key:'l_price',msg:'零售价格'} ,
      // {key:'l_region_price',msg:'零售原价'} ,
      {key:'l_danwei',msg:'零售单位'} ,
      // {key:'l_guige',msg:'零售规格'} ,
      {key:'productName', msg:'商品名称'} ,
    ] 
    var temp=[]
    for(let ele in formatArr){
      that.format(formatArr[ele],temp)
    }
    if(temp.every(s=>s==='T')){
      that.nextFormat()//验证商品图片和商品分区
    }
    console.log(temp)
  },
  format(obj,temp){
    if(!this.data[obj.key]){
      wx.showToast({
        title: `请输入${obj.msg}`,
        icon:'none'
      })
      temp.push('F')
      return
    }else{
      temp.push('T')
      return
    }
  },
  nextFormat(){ 
    var that=this
    console.log(this.data.collectionList)
    console.log(this.data.collectionIndex)
    console.log(app.tounicode(this.data.collectionList[this.data.collectionIndex]))
    console.log(this.data.imgList)
    if(!this.data.imgList.length){
      this.wx.showToast({
        title: '请上传商品照片',
        icon:'none'
      })
      return
    }
    if(this.data.isSubmit)return
    this.uploadImg()
  },
  uploadImg(){
    var that=this
    wx.showLoading({//提交loading
      title: '提交中',
      icon:'none'
    })

    if(this.data.imgList.length===1){
      wx.cloud.uploadFile({//第一张照片
        cloudPath: `${app.tounicode(that.data.collectionList[that.data.collectionIndex])}${app.tounicode(that.data.productName)}1.png`,
        filePath: that.data.imgList[0],
        config:{
          env:app.globalData.env
        },
        success(res) {
        //上传成功后会返回永久地址
          that.data.fileID1=res.fileID
          wx.cloud.getTempFileURL({
            fileList: [that.data.fileID1],
            success: r => {
              console.log(r)
              that.data.tempFileURL1=r.fileList[0].tempFileURL
              that.trueSubmit()
            },
          })
        }
      })
    }

    if(this.data.imgList.length===2){
      let arr=[]
      wx.cloud.uploadFile({//第一张照片
        cloudPath:`${app.tounicode(that.data.collectionList[that.data.collectionIndex])}${app.tounicode(that.data.productName)}1.png`,
        filePath: that.data.imgList[0],
        config:{
          env:app.globalData.env
        },
        success(res) {
        //上传成功后会返回永久地址
          that.data.fileID1=res.fileID
          arr.push('T')
          if(arr.length==2){
            wx.cloud.getTempFileURL({
              fileList: [that.data.fileID1,that.data.fileID2],
              success: r => {
                console.log(r)
                that.data.tempFileURL1=r.fileList[0].tempFileURL
                that.data.tempFileURL2=r.fileList[1].tempFileURL
                that.trueSubmit()
              },
            })
          }
        }
      })
      wx.cloud.uploadFile({//第二张照片
        cloudPath:`${app.tounicode(that.data.collectionList[that.data.collectionIndex])}${app.tounicode(that.data.productName)}2.png`,
        filePath: that.data.imgList[1],
        config:{
          env:app.globalData.env
        },
        success(res) {
        //上传成功后会返回永久地址
          that.data.fileID2=res.fileID
          arr.push('T')
          if(arr.length==2){
            wx.cloud.getTempFileURL({
              fileList: [that.data.fileID1,that.data.fileID2],
              success: r => {
                console.log(r)
                that.data.tempFileURL1=r.fileList[0].tempFileURL
                that.data.tempFileURL2=r.fileList[1].tempFileURL
                that.trueSubmit()
              },
            })
          }
        }
      })
    }

    if(this.data.imgList.length===3){
      let arr=[]
      wx.cloud.uploadFile({//第一张照片
        cloudPath: `${app.tounicode(that.data.collectionList[that.data.collectionIndex])}${app.tounicode(that.data.productName)}1.png`,
        filePath: that.data.imgList[0],
        config:{
          env:app.globalData.env
        },
        success(res) {
        //上传成功后会返回永久地址
          that.data.fileID1=res.fileID
          arr.push('T')
          if(arr.length==3){
            wx.cloud.getTempFileURL({
              fileList: [that.data.fileID1,that.data.fileID2,that.data.fileID3],
              success: r => {
                console.log(r)
                that.data.tempFileURL1=r.fileList[0].tempFileURL
                that.data.tempFileURL2=r.fileList[1].tempFileURL
                that.data.tempFileURL3=r.fileList[2].tempFileURL
                that.trueSubmit()
              },
            })
          }
        }
      })
      wx.cloud.uploadFile({//第二张照片
        cloudPath: `${app.tounicode(that.data.collectionList[that.data.collectionIndex])}${app.tounicode(that.data.productName)}2.png`,
        filePath: that.data.imgList[1],
        config:{
          env:app.globalData.env
        },
        success(res) {
        //上传成功后会返回永久地址
          that.data.fileID2=res.fileID
          arr.push('T')
          if(arr.length==3){
            wx.cloud.getTempFileURL({
              fileList: [that.data.fileID1,that.data.fileID2,that.data.fileID3],
              success: r => {
                console.log(r)
                that.data.tempFileURL1=r.fileList[0].tempFileURL
                that.data.tempFileURL2=r.fileList[1].tempFileURL
                that.data.tempFileURL3=r.fileList[2].tempFileURL
                that.trueSubmit()
              },
            })
          }
        }
      })
      wx.cloud.uploadFile({//第三张照片
        cloudPath: `${app.tounicode(that.data.collectionList[that.data.collectionIndex])}${app.tounicode(that.data.productName)}3.png`,
        filePath: that.data.imgList[2],
        config:{
          env:app.globalData.env
        },
        success(res) {
        //上传成功后会返回永久地址
          that.data.fileID3=res.fileID
          arr.push('T')
          if(arr.length==3){
            wx.cloud.getTempFileURL({
              fileList: [that.data.fileID1,that.data.fileID2,that.data.fileID3],
              success: r => {
                console.log(r)
                that.data.tempFileURL1=r.fileList[0].tempFileURL
                that.data.tempFileURL2=r.fileList[1].tempFileURL
                that.data.tempFileURL3=r.fileList[2].tempFileURL
                that.trueSubmit()
              },
            })
          }
        }
      })
    }
    
  },
  trueSubmit(){
    var that=this
    app.getRole().then(isadmin=>{
      if(isadmin){
        wx.cloud.callFunction({
          name:'add_record',
          data:{
            access_token:wx.getStorageSync('access_token'),
            env:app.globalData.env,
            collectionName:app.tounicode(that.data.collectionList[that.data.collectionIndex]),
            record:{
              productName:that.data.productName,
              productArea:that.data.collectionList[that.data.collectionIndex],
              fileID1:that.data.fileID1,
              fileID2:that.data.fileID2,
              fileID3:that.data.fileID3,
              tempFileURL1:that.data.tempFileURL1,
              tempFileURL2:that.data.tempFileURL2,
              tempFileURL3:that.data.tempFileURL3,
              l_guige:that.data.l_guige,
              l_danwei:that.data.l_danwei,
              l_region_price:that.data.l_region_price,
              l_price:that.data.l_price,
              p_guige:that.data.p_guige,
              p_danwei:that.data.p_danwei,
              p_region_price:that.data.p_region_price,
              p_price:that.data.p_price,
            }
          },
          success(res){
            console.log(res)
            wx.hideLoading({
              complete: (res) => {},
            })
            that.setData({
              collectionIndex:0,
              productName:'',
              imgList:[],
              l_guige:'',
              l_danwei:'',
              l_region_price:'',
              l_price:'',
              p_guige:'',
              p_danwei:'',
              p_region_price:'',
              p_price:'',
              fileID1:'',
              fileID2:'',
              fileID3:'',
              tempFileURL1:'',
              tempFileURL2:'',
              tempFileURL3:'',
              isSubmit:false
            })
            if(res.result.errcode===0){
              wx.showToast({
                title: '添加成功',
              })
            }
          },  
          fail(err){
            wx.hideLoading({
              complete: (res) => {},
            })
            that.setData({
              collectionIndex:0,
              productName:'',
              imgList:[],
              l_guige:'',
              l_danwei:'',
              l_region_price:'',
              l_price:'',
              p_guige:'',
              p_danwei:'',
              p_region_price:'',
              p_price:'',
              fileID1:'',
              fileID2:'',
              fileID3:'',
              tempFileURL1:'',
              tempFileURL2:'',
              tempFileURL3:'',
              isSubmit:false
            })
            console.log(err)
          }
        })
      }else{
        wx.navigateBack({
          delta: 2,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})