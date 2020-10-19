// miniprogram/pages/admin/admin.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token:'',
    collectionName:'',
    productArea:'',
    collectionList:[],
    collectionIndex:0,
    productName:'',
    ///
    menuList:[{
      name:'添加货架',
      url:''
    },{
      name:'删除货架',
      url:''
    },{
      name:'添加商品',
      url:''
    },{
      name:'更改商品',
      url:''
    },{
      name:'删除商品',
      url:''
    },{
      name:'顾客查询',
      url:''
    },{
      name:'建议反馈',
      url:''
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      access_token:wx.getStorageSync('access_token'),
    })
  },
  add_collection(){
    wx.navigateTo({
      url: '/pages/admin/add_collection/add_collection',
    })
  },
  delete_collection(){
    wx.navigateTo({
      url: '/pages/admin/delete_collection/delete_collection',
    })
  },
  user(){
    wx.navigateTo({
      url: '/pages/admin/users_get_collection/users_get_collection',
    })
  },
  feedbacklist(){
    wx.navigateTo({
      url: '/pages/admin/feedbacklist/feedbacklist',
    })
  },
  admin(){
    wx.navigateTo({
      url: '/pages/admin/admin_manage/admin_manage',
    })
  },
  add_product(){
    wx.navigateTo({
      url: '/pages/admin/add_product/add_product',
    })
  },
  edit_product(){
    wx.showToast({
      title: '开发中',
      icon:'none'
    })
  },
  del_product(){
    wx.navigateTo({
      url: './delete_product/delete_product',
    })
  },
  getProductArea(e){
    this.setData({
      collectionIndex:e.detail.value,
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