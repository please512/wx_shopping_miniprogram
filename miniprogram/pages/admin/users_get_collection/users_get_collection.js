// miniprogram/pages/admin/delete_collection/delete_collection.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token:'',
    collectionList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      access_token:wx.getStorageSync('access_token'),
    })
    this.init()
  },
  init(){
    var that=this
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name:'get_record',
      data:{
        access_token:this.data.access_token,
        env:app.globalData.env,
        collectionName:'Users',
        limit:1000,
        params:{}
      },
      success(res){
        if(res.result.errcode===42001 || res.result.errcode===40001 || res.result.errcode===41001){
          wx.cloud.callFunction({
            name:'access_token',
            success(res){
              wx.setStorageSync('access_token', JSON.parse(res.result).access_token)
              that.init()
            },
            fail(err){
              console.log(err)
            }
          })
        }
        wx.hideLoading({
          complete: (res) => {},
        })
        console.log(res.result.data)
        if(res.result.errcode===0){
          var collectionList=[]
          if(res.result.data.length){
            res.result.data.forEach(s=>{
              collectionList.push(JSON.parse(s))
            })
          }
          that.setData({
            collectionList:collectionList
          })
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
  show(e){
    console.log(e.currentTarget.dataset.address)
    wx.showModal({
      title:'用户联系地址',
      content:e.currentTarget.dataset.address?e.currentTarget.dataset.address:'该用户未注册',
      cancelColor: '#ccc',
      confirmColor:'#1296db',
      success(){}
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