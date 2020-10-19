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
      name:'get_collections',
      data:{
        access_token:this.data.access_token,
        env:app.globalData.env,
        limit:1000
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
        if(res.result.collections.length){
          let collectionList=[]
          console.log(res.result.collections)
          res.result.collections.filter(s=>s.name!=='Users' && s.name!=='Advices').forEach(el => {
            collectionList.push(app.tohanzi(el.name))
          });
          that.setData({
            collectionList:collectionList
          })
          console.log(collectionList)
          if(!collectionList.length){
            wx.showToast({
              title: '请添加货架',
              icon:'none'
            })
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1,
              })
            },1500)
          }
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
  delete_collection(e){
    var that=this
    wx.showModal({
      title:'提示',
      content:'删除该货架及架上所有商品',
      confirmColor:'#1296db',
      cancelColor: '#ccc',
      success(tip){
        if(tip.confirm){
          app.getRole().then(isadmin=>{
            if(isadmin){
              wx.showLoading({
                title: '',
              })
              let collectionName=app.tounicode(e.currentTarget.dataset.item)
              wx.cloud.callFunction({
                name:'delete_collection',
                data:{
                  env:app.globalData.env,
                  access_token:that.data.access_token,
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
            }else{
              wx.navigateBack({
                delta: 2,
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