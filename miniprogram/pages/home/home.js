// miniprogram/pages/home/home.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList:[],
    searchList:[],
    text:'',
    search:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //创建一个集合
    // console.log(wx.getStorageSync('openid'))
    // console.log(app.tounicode('烟酒区'))
    // console.log(app.tohanzi('_u70df_u9152_u533a'))
    this.getCollections()
  },
  refresh(){
    // this.setData({
    //   search:false
    // })
    this.getCollections()
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
        if(res.result.collections.length){
          let collectionList=[]
          console.log(res.result.collections)
          res.result.collections.filter(s=>s.name!=='Users' && s.name!=='Advices').forEach(el => {
            collectionList.push(app.tohanzi(el.name))
          });
          that.digui(collectionList)
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
  digui(list){
    let that=this
    var len=list.length
    var num=0
    that.setData({
      productList:[]
    })
    console.log(list)
    if(!list.length){
      wx.hideLoading({
        success: (res) => {},
      })
      this.setData({
        searchList:[],
        search:true
      })
    }
    for(let i=0;i<list.length;i++){
      wx.cloud.callFunction({
        name:'get_record',
        data:{
          access_token:wx.getStorageSync('access_token'),
          env:app.globalData.env,
          collectionName:app.tounicode(list[i]),
          limit:1000,
          params:{}
        },
        success(res){
          if(res.result.errcode===0){
            list.splice(i,1)
            if(res.result.data.length){
              var productList=that.data.productList
              res.result.data.forEach(s=>{
                productList.push(JSON.parse(s))
              })
              that.setData({
                search:false,
                productList:productList
              })
            }
            num++
            if(num==len){
              that.zhanshi()
            }
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
    }
  },
  zhanshi(){
    var that=this
    wx.hideLoading({
      complete: (res) => {},
    })
    console.log(that.data.productList)
  },
  detail(e){
    let item=e.currentTarget.dataset.item
    let str=''
    for(let i in item){
      str+=i+'='+item[i]+'&'
    }
    wx.navigateTo({
      url: '../product_detail/product_detail?'+str,
    })
  },
  changeInput(e){
    this.setData({
      text:e.detail.value
    })
  },
  onTabItemTap(item){
    console.log(item.text)
  },
  search(){
    var that=this
    console.log(this.data.productList)
    console.log(this.data.text)
    console.log('search')
    wx.showLoading({
      title: '加载中',
      icon:'none'
    })
    let searchList=[]
    this.data.productList.forEach(s=>{
      if(s.productName.indexOf(this.data.text)!=-1){
        searchList.push(s)
      }
    })
    setTimeout(()=>{
      wx.hideLoading({
        success: (res) => {},
      })
      that.setData({
        searchList:searchList,
        search:true
      })
    },1000)
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