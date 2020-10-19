// miniprogram/pages/my/my.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    avatarUrl:'',
    nickName:'',
    isShowConfirm:false,
    password:'',
    requesting:false,
    setShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  login(){
    wx.navigateTo({
      url: '../../pages/login_tip/login_tip',
    })
  },
  address(){},
  phone(){},
  send(){
    wx.showToast({
      title: '正在开发中',
      icon:'none'
    })
  },
  concact(){
    wx.showModal({
      title:'您将给海浩针织拨打电话',
      content:'15515849073',
      cancelColor: '#ccc',
      confirmColor:'#1296db',
      success:(res)=>{
        if(res.confirm){
          wx.makePhoneCall({
            phoneNumber: '15515849073',
          })
        }
      }
    })
  },
  feedback(){
    wx.navigateTo({
      url: '/pages/my/feedback/feedback',
    })
  },
  authUser(e){
    console.log(e)
    if(!e.detail.userInfo)return 
    this.setData({
      isLogin:true,
      nickName:e.detail.userInfo.nickName,
      avatarUrl:e.detail.userInfo.avatarUrl
    })
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.getUser()
  },
  getUser(){
    var that=this
    if(this.data.requesting)return
    wx.showLoading({
      title: '',
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
          if(!res.result.data.length){//添加用户
            that.addUser()
          }else{//修改用户
            that.editInfo()
          }
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
  addUser(){
    var that=this
    if(this.data.requesting)return
    wx.showLoading({
      title: '授权中',
    })
    this.setData({
      requesting:true
    })
    wx.cloud.callFunction({
      name:'add_record',
      data:{
        access_token:wx.getStorageSync('access_token'),
        env:app.globalData.env,
        collectionName:'Users',
        record:{
          tel:'',
          address:'',
          isAdmin:'0',
          nickName:wx.getStorageSync('userInfo').nickName,
          openid:wx.getStorageSync('openid'),
          gender:wx.getStorageSync('userInfo').gender,
          language:wx.getStorageSync('userInfo').language,
          city:wx.getStorageSync('userInfo').city,
          province:wx.getStorageSync('userInfo').province,
          country:wx.getStorageSync('userInfo').country,
          avatarUrl:wx.getStorageSync('userInfo').avatarUrl,
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
          that.editInfo()
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
      }
    })
  },
  editInfo(){
    wx.navigateTo({
      url: './myInfo/myInfo?nickName='+wx.getStorageSync('userInfo').nickName,
    })
  },
  set(){
    console.log('授权获取手机号校验')
    this.setData({
      isShowConfirm:true,
      password:''
    })
  },
  cancel(){
    this.setData({
      isShowConfirm:false
    })
  },
  confirm(){
    if(!this.data.password){
      wx.showToast({
        title: '请输入管理员密码',
        icon:'none'
      })
      return
    }
    if(this.data.password!=='123456'){
      wx.showToast({
        title: '管理员密码不正确',
        icon:'none'
      })
      return
    }
    this.setData({
      isShowConfirm:false
    })
    wx.navigateTo({
      url: '../../pages/admin/admin',
    })
  },
  inputpassword(e){
    this.setData({
      password:e.detail.password
    })
  },
  onTabItemTap(item){
    // this.init()
  },
  init(){
    let userInfo=wx.getStorageSync('userInfo')
    if(userInfo){
      this.setData({
        isLogin:true,
        nickName:userInfo.nickName,
        avatarUrl:userInfo.avatarUrl
      })
    }else{
      this.setData({
        isLogin:false,
        nickName:'',
        avatarUrl:''
      })
    }
    this.getAdminBtn()
  },
  getAdminBtn(){
    var that=this
    wx.showLoading({
      title: '查询用户身份',
      icon:'none'
    })
    wx.cloud.callFunction({
      name:'get_record',
      data:{
        access_token:wx.getStorageSync('access_token'),
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
              that.getAdminBtn()
            },
            fail(err){
              console.log(err)
            }
          })
        }
        wx.hideLoading({
          success: (res) => {},
        })
        console.log(res.result.data)
        if(res.result.errcode===0){
          var collectionList=[]
          if(res.result.data.length){
            res.result.data.forEach(s=>{
              collectionList.push(JSON.parse(s))
            })
          }
          let currentUser=collectionList.filter(s=>s.openid===wx.getStorageSync('openid'))
          if(currentUser.length && currentUser[0].isAdmin==='1'){
            that.setData({
              setShow:true
            })
          }else{
            that.setData({
              setShow:false
            })
          }
        }
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