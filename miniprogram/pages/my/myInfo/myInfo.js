// miniprogram/pages/my/myInfo/myInfo.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel:'',
    address:'',
    isAdmin:'',
    nickName:'',
    _id:'',
    gender:'',
    language:'',
    city:'',
    province:'',
    country:'',
    avatarUrl:'',
    requesting:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nickName:options.nickName
    })
  },
  init(){
    var that=this
    if(this.data.requesting)return
    wx.showLoading({
      title: '加载中',
      icon:'none'
    })
    wx.cloud.callFunction({
      name:'get_record',
      data:{
        access_token:wx.getStorageSync('access_token'),
        env:app.globalData.env,
        collectionName:'Users',
        limit:1000,
        params:{
          openid:wx.getStorageSync('openid'),
        } 
      },
      success(res){
        console.log(res)
        wx.hideLoading({
          complete: (res) => {},
        })
        that.setData({
          requesting:false
        })
        if(res.result.errcode===0){
          // if(!res.result.data.length)return
          let {address,tel,isAdmin,nickName,_id,gender,language,city,province,country,avatarUrl} = JSON.parse(res.result.data)
          that.setData({
            nickName:nickName,
            address:address,
            tel:tel,
            isAdmin:isAdmin,
            _id:_id,
            gender:gender,
            language:language,
            city:city,
            province:province,
            country:country,
            avatarUrl:avatarUrl
          })
        }else{
          wx.showToast({
            title: '服务器错误',
            icon:'none'
          })
        }
      },
      fail(err){
        console.log(err)
      }
    })
  },
  telinp(e){
    let tel=e.detail.value
    this.setData({
      tel:tel
    })
  },
  addressinp(e){
    let address=e.detail.value
    this.setData({
      address:address
    })
  },
  submit(){
    if(!this.data.tel){
      wx.showToast({
        title: '请输入联系电话',
        icon:'none'
      })
      return
    }
    if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.data.tel))){
      wx.showToast({
        title: '联系电话格式不正确',
        icon:'none'
      })
      return
    }
    if(!this.data.address){
      wx.showToast({
        title: '请输入联系地址',
        icon:'none'
      })
      return
    }
    wx.showLoading({
      title: '提交中',
      icon:'none'
    })
    this.trueSubmit()
  },
  trueSubmit(){
    var that=this
    console.log('修改')
    console.log(this.data._id)
    console.log(this.data.tel)
    console.log(this.data.address)
    console.log(this.data.nickName)
    if(this.data.requesting)return
    wx.cloud.callFunction({
      name:'edit_record',
      data:{
        access_token:wx.getStorageSync('access_token'),
        env:app.globalData.env,
        collectionName:'Users',
        _id:this.data._id,
        record:{
          tel:this.data.tel,
          address:this.data.address,
          isAdmin:this.data.isAdmin,
          nickName:this.data.nickName,
          openid:wx.getStorageSync('openid'),
          gender:this.data.gender,
          language:this.data.language,
          city:this.data.city,
          province:this.data.province,
          country:this.data.country,
          avatarUrl:this.data.avatarUrl,
        }
      },
      success(res){
        that.setData({
          requesting:false
        })
        wx.hideLoading({
          complete: (res) => {},
        })
        console.log(res)
        if(res.result.errcode===0){
          wx.showToast({
            title: '保存成功',
          })
        }else{
          wx.showToast({
            title: '保存失败',
          })
        }
      },
      fail(err){
        that.setData({
          requesting:false
        })
        wx.hideLoading({
          complete: (res) => {},
        })
        console.log(err)
        wx.showToast({
          title: '请求失败',
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