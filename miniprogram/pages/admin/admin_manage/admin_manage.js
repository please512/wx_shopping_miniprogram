// miniprogram/pages/admin/delete_collection/delete_collection.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token:'',
    userList:[],
    requesting:false
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
  editAdmin(item,oporate){
    var that=this
    if(this.data.requesting) return
    this.setData({
      requesting:true
    })
    wx.showLoading({
      title: oporate==0?'删除中':'添加中',
      icon:'none'
    })
    wx.cloud.callFunction({
      name:'edit_record',
      data:{
        access_token:wx.getStorageSync('access_token'),
        env:app.globalData.env,
        collectionName:'Users',
        _id:item._id,
        record:{
          tel:item.tel,
          address:item.address,
          isAdmin:oporate.toString(),
          nickName:item.nickName,
          openid:item.openid,
          gender:item.gender,
          language:item.language,
          city:item.city,
          province:item.province,
          country:item.country,
          avatarUrl:item.avatarUrl,
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
          that.init()
          wx.showToast({
            title: oporate==0?'删除成功':'添加成功',
          })
        }else{
          wx.showToast({
            title: oporate==0?'删除失败':'添加失败',
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
  getAgainUserList(item,opera){
    var that=this
    wx.showLoading({
      title: '查询用户身份',
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
        wx.hideLoading({
          complete: (res) => {},
        })
        console.log(res.result.data)
        if(res.result.errcode===0){
          var userList=[]
          if(res.result.data.length){
            res.result.data.forEach(s=>{
              if(JSON.parse(s).openid!==wx.getStorageSync('openid')){
                userList.push(JSON.parse(s))
              }
            })
          }
          userList.forEach(s=>{
            if(s._id===item._id){
              console.log('当前用户身份'+s.isAdmin)
              console.log(opera.toString())
              if(s.isAdmin==opera.toString()){
                wx.showModal({
                  title:'提示',
                  content: opera?'请勿重复设置管理员':'请勿重复删除管理员',
                  confirmColor:'#1296db',
                  cancelColor: '#ccc',
                  success(res){
                    that.init()
                  }
                })
              }else{
                that.editAdmin(item,opera)
              }
            }
          })
        }
      }
    })
  },
  delete_admin(e){
    var that=this
    app.getRole().then(isadmin=>{
      if(isadmin){
        that.getAgainUserList(e.currentTarget.dataset.item,0)
      }else{
        wx.navigateBack({
          delta: 2,
        })
      }
    })
  },
  add_admin(e){
    var that=this
    app.getRole().then(isadmin=>{
      if(isadmin){
        that.getAgainUserList(e.currentTarget.dataset.item,1)
      }else{
        wx.navigateBack({
          delta: 2,
        })
      }
    })
  },
  init(){
    var that=this
    wx.showLoading({
      title: '',
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
          var userList=[]
          if(res.result.data.length){
            res.result.data.forEach(s=>{
              if(JSON.parse(s).openid!==wx.getStorageSync('openid')){
                userList.push(JSON.parse(s))
              }
            })
          }
          console.log(userList)
          that.setData({
            userList:userList
          })
          if(!userList.length){
            wx.showToast({
              title: '暂无人员信息',
              icon:'none'
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1,
              })
            },1500)
          }
        }
      }
    })
  },
  delete_collection(e){
    var that=this
    wx.showModal({
      title:'提示',
      content:'删除该货架及架上所有商品',
      confirmColor:'#1296db',
      cancelColor: '#ccc',
      success(tip){
        if(tip.confirm){
          wx.showLoading({
            title: '删除中',
          })
          let collectionName=app.tounicode(e.currentTarget.dataset.item)
          wx.cloud.callFunction({
            name:'delete_collection',
            data:{
              env:app.globalData.env,
              access_token:this.data.access_token,
              collection_name:collectionName
            },
            success(res){
              wx.hideLoading({
                complete: (res) => {},
              })
              console.log(res)
              if(res.result.errcode===0){
                wx.showToast({
                  title: '删除成功',
                })
                that.init()
              }else{
                wx.showToast({
                  title: '删除失败',
                  icon:'none'
                })
              }
            },
            fail(err){
              console.log(err)
              wx.hideLoading({
                complete: (res) => {},
              })
              wx.showToast({
                title: '删除失败',
                icon:'none'
              })
            }
          })
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