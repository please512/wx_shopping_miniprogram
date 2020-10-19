// miniprogram/pages/my/feedback/feedback.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    advice:'',
    requesting:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  adviceInp(e){
    this.setData({
      advice:e.detail.value
    })
  },
  submit(){
    var that=this
    if(this.data.requesting)return
    if(!this.data.advice.trim()){
      wx.showToast({
        title: '请输入意见反馈',
        icon:'none'
      })
      return
    }
    wx.showLoading({
      title: '请求中',
    })
    console.log(this.data.advice)
    wx.cloud.callFunction({
      name:'add_record',
      data:{
        access_token:wx.getStorageSync('access_token'),
        env:app.globalData.env,
        collectionName:'Advices',
        record:{
          advice:this.data.advice.trim(),
          nickName:this.data.nickName,
          openid:wx.getStorageSync('openid'),
        }
      },
      success(res){
        that.setData({
          requesting:false,
          advice:''
        })
        wx.hideLoading({
          complete: (res) => {},
        })
        console.log(res)
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
          requesting:false,
          advice:''
        })
        console.log(err)
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