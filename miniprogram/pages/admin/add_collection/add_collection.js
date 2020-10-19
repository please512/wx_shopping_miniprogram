// miniprogram/pages/my/myInfo/myInfo.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      access_token:wx.getStorageSync('access_token'),
    })
  },

  collectionInp(e){
    this.setData({
      collectionName:e.detail.value
    })
  },
  submit(){
    let collectionName=this.data.collectionName.trim()
    if(!collectionName){
      wx.showToast({
        title: '请输入货架名称',
        icon:'none'
      })
      return
    }
    console.log(collectionName)
    this.add_collection()
  },
  add_collection(){
    var that=this
    app.getRole().then(isadmin=>{
      if(isadmin){
        wx.showLoading({
          title: '',
          icon:'none'
        })
        let collectionName=app.tounicode(this.data.collectionName.trim())
        wx.cloud.callFunction({
          name:'add_collection',
          data:{
            env:app.globalData.env,
            access_token:this.data.access_token,
            collection_name:collectionName
          },
          success(res){
            wx.hideLoading({
              complete: (res) => {},
            })
            if(res.result.errcode===0){
              wx.showToast({
                title: '添加成功',
              })
            }else{
              wx.showToast({
                title: '添加失败',
                icon:'none'
              })
            }
            console.log(res)
          },
          fail(err){
            console.log(err)
            wx.hideLoading({
              complete: (res) => {},
            })
            wx.showToast({
              title: '添加失败',
              icon:'none'
            })
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