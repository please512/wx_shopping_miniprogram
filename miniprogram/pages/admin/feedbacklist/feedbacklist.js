// miniprogram/pages/admin/delete_collection/delete_collection.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token:'',
    collectionList:[],
    adviceList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
          that.getadviceList()
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
  getadviceList(){
    var that=this
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name:'get_record',
      data:{
        access_token:this.data.access_token,
        env:app.globalData.env,
        collectionName:'Advices',
        limit:1000,
        params:{}
      },
      success(res){
        wx.hideLoading({
          complete: (res) => {},
        })
        if(res.result.errcode===0){
          var adviceList=[]
          if(res.result.data.length){
            res.result.data.forEach(s=>{
              adviceList.push(JSON.parse(s))
            })
          }
          that.setData({
            adviceList:adviceList
          })
          that.resultFormat()
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
  resultFormat(){
    let collectionList= this.data.collectionList
    let adviceList= this.data.adviceList
    if(collectionList.length){
      collectionList.forEach(user=>{
        adviceList.forEach(advice=>{
          if(advice.openid===user.openid){
            advice.tel=user.tel
            advice.nickName=user.nickName
            advice.address=user.address
            advice.userId=user._id
          }
        })
      })
    }
    adviceList.forEach(advice=>{
      if(!advice.userId){
        advice.tel='***********'
        advice.nickName='匿名用户'
        advice.address='***********'
        advice.userId=''
      }
    })
    console.log(adviceList)
    this.setData({
      adviceList:adviceList
    })
    if(!adviceList.length){
      wx.showToast({
        title: '暂无意见反馈',
        icon:'none'
      })
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1,
        })
      },1500)
    }
  },
  show(e){
    let item=e.currentTarget.dataset.item
    wx.showModal({
      title:'意见反馈详情',
      content:`${item.advice}`,
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
    this.setData({
      access_token:wx.getStorageSync('access_token'),
    })
    this.init()
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