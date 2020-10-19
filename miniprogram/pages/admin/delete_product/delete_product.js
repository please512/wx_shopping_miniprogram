// miniprogram/pages/admin/delete_product/delete_product.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionList:['零食区'],
    collectionIndex:0,
    productList:[],
    loading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCollections()
  },
  getCollections(){
    var that=this
    wx.showLoading({
      title: '加载中',
      icon:'none'
    })
    this.setData({
      loading:true
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
        console.log(res)
        if(res.result.collections.length){
          let collectionList=[]
          console.log(res.result.collections)
          res.result.collections.filter(s=>s.name!=='Users' && s.name!=='Advices').forEach(el => {
            collectionList.push(app.tohanzi(el.name))
          });
          that.setData({
            collectionList:collectionList
          })
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
            return
          }
          that.getProducts(collectionList[0])
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
  getProductArea(e){
    this.setData({
      collectionIndex:e.detail.value,
    })
    wx.showLoading({
      title: '加载中',
      icon:'none'
    })
    this.getProducts(this.data.collectionList[this.data.collectionIndex])
  },
  getProducts(collectionName){
    var that=this
    wx.cloud.callFunction({
      name:'get_record',
      data:{
        access_token:wx.getStorageSync('access_token'),
        env:app.globalData.env,
        collectionName:app.tounicode(collectionName),
        limit:1000,
        params:{}
      },
      success(res){
        that.setData({
          loading:false
        })
        wx.hideLoading({
          complete: (res) => {},
        })
        if(res.result.errcode===0){
          if(res.result.data.length){
            let productList=[]
            res.result.data.forEach(s=>{
              productList.push(JSON.parse(s))
            })
            that.setData({
              productList:productList
            })
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
  },
  dele(e){
    var that=this
    let item=e.currentTarget.dataset.item
    wx.showModal({
      title:'提示',
      content:'确定删除该商品？',
      success(res){
        if(res.confirm){
          console.log('删除')
          wx.showLoading({
            title: '删除中',
            icon:'none'
          })
          wx.cloud.callFunction({
            name:'delete_record',
            data:{
              access_token:wx.getStorageSync('access_token'),
              env:app.globalData.env,
              collectionName:app.tounicode(item.productArea),
              _id:item._id
            },
            success(res){
              console.log(res)
              wx.hideLoading({
                success: (res) => {},
              })
              that.getProducts(that.data.collectionList[that.data.collectionIndex])
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