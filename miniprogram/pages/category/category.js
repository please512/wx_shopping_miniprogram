// miniprogram/pages/category/category.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionList:[],
    selectIndex:0,
    productList:[],
    imgUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  close(){
    this.setData({
      imgShow:false,
      imgUrl:''
    })
  },
  seeProduct(e){
    console.log(e.currentTarget.dataset.item)
    let item=e.currentTarget.dataset.item
    let str=''
    for(let i in item){
      str+=i+'='+item[i]+'&'
    }
    console.log(str)
    wx.navigateTo({
      url: '../product_detail/product_detail?'+str,
    })
    // this.setData({
    //   imgShow:true,
    //   imgUrl:e.currentTarget.dataset.item.tempFileURL1
    // })
  },
  selectItem(e){
    // wx.showLoading({
    //   title: '加载中',
    // })
    this.setData({
      productList:[],
      selectIndex:e.currentTarget.dataset.index
    })
    this.getProducts()
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
        console.log(res)
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
        wx.hideLoading({
          complete: (res) => {},
        })
        console.log(res.result.collections)
        if(res.result.collections.length){
          let collectionList=[]
          console.log(res.result.collections)
          res.result.collections.filter(s=>s.name!=='Users' && s.name!=='Advices').forEach(el => {
            collectionList.push(app.tohanzi(el.name))
          });
          that.setData({
            collectionList:collectionList
          })
          that.getProducts()
        }
      },
      fail(err){
        wx.hideLoading({
          complete: (res) => {},
        })
        wx.showToast({
          title: '请求失败',
          icon:'none'
        })
        console.log(err)
      }
    })
  },
  getProducts(){
    let that=this
    let { collectionList,selectIndex } = that.data
    console.log(collectionList)
    if(!collectionList.length){
      wx.showToast({
        title: '请添加分类',
        icon:'none'
      })
      return
    }
    let collectionName=app.tounicode(collectionList[selectIndex])
    wx.showLoading({
      title: '加载中',
      icon:'none'
    })
    wx.cloud.callFunction({
      name:'get_record',
      data:{
        access_token:wx.getStorageSync('access_token'),
        env:app.globalData.env,
        collectionName:collectionName,
        limit:1000,
        params:{}
      },
      success(res){
        wx.hideLoading({
          complete: (res) => {},
        })
        console.log(res.result.data)
        if(res.result.errcode===0){
          var productList=[]
          if(res.result.data.length){
            res.result.data.forEach(s=>{
              productList.push(JSON.parse(s))
            })
          }
          that.setData({
            productList:productList
          })
          console.log(productList)
          that.getUrlByFileId()
        }
      },
      fail(){
        wx.showToast({
          title: '请求失败',
        })
        wx.hideLoading({
          complete: (res) => {},
        })
      }
    })
  },
  getUrlByFileId(){
    console.log(this.data.productList)
  },
  onTabItemTap(item){
    this.close()
    this.setData({
      selectIndex:0,
      productList:[]
    })
    this.getCollections()
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
    this.getCollections()
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