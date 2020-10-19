// miniprogram/pages/car/car.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allchecked:false,
    data:[],
    num:0,
    allMoney:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  del(){
    var that=this
    if(!wx.getStorageSync('car').filter(s=>s.checked).length){
      wx.showToast({
        title: '请选择商品',
        icon:'none'
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'从购物车中删除？',
        success(res){
          if(res.confirm){
            let data=wx.getStorageSync('car')
            console.log(wx.getStorageSync('car').filter(s=>s.checked))
            wx.getStorageSync('car').filter(s=>s.checked).forEach(item=>{
              data.forEach((s,index)=>{
                if(s.detail._id===item.detail._id){
                  data.splice(index,1)
                }
              })
            })
            if(data.some(s=>!s.checked)){
              that.setData({
                allchecked:false
              })
            }else{
              that.setData({
                allchecked:true
              })
            }
            wx.setStorageSync('car', data)
            that.setData({
              data:data
            })
            that.getAllMoney(wx.getStorageSync('car'))
          }
        }
      })
    }
  },
  pay(){
    console.log(wx.getStorageSync('car').filter(s=>s.checked))
    wx.showToast({
      title: '开发中',
      icon:'none'
    })
  },
  jia(e){
    let car=this.data.data
    let item=e.currentTarget.dataset.item
    car.forEach(s=>{
      if(s.detail._id===item.detail._id){
        s.num++
      }
    })
    wx.setStorageSync('car', car)
    this.setData({
      data:wx.getStorageSync('car')
    })
    this.getAllMoney(wx.getStorageSync('car'))
  },
  jian(e){
    var that=this
    let car=that.data.data
    let item=e.currentTarget.dataset.item
    car.forEach((s,index)=>{
      if(s.detail._id===item.detail._id){
        if(s.num==1){
          wx.showModal({
            title:'提示',
            content:'从购物车中删除？',
            success(res){
              console.log(res)
              if(res.confirm){
                car.splice(index,1)
                wx.setStorageSync('car', car)
                that.setData({
                  data:wx.getStorageSync('car')
                })
                that.getAllMoney(that.data.data)
                if(wx.getStorageSync('car').some(s=>!s.checked)){
                  that.setData({
                    allchecked:false
                  })
                }else{
                  that.setData({
                    allchecked:true
                  })
                }
              }
            }
          })
        }else{
          s.num--
          wx.setStorageSync('car', car)
          that.setData({
            data:wx.getStorageSync('car')
          })
          that.getAllMoney(wx.getStorageSync('car'))
        }
      }
    })
  },
  allChange(){
    let data=this.data.data
    if(data.some(s=>!s.checked)){
      console.log('有空')
      data.forEach(s=>{
        s.checked=true
      })
      wx.setStorageSync('car', data)
      this.setData({
        allchecked:true
      })
    }else{
      data.forEach(s=>{
        s.checked=false
      })
      wx.setStorageSync('car', data)
      this.setData({
        allchecked:false
      })
    }
    this.setData({
      data:wx.getStorageSync('car')
    })
    this.getAllMoney(this.data.data)
  },
  radioChange(e){
    let item=e.currentTarget.dataset.item
    let data=this.data.data
    data.forEach(s=>{
      if(s.detail._id===item.detail._id){
        s.checked=!s.checked
      }
    })
    this.setData({
      data:data
    })
    this.getAllMoney(this.data.data)
    wx.setStorageSync('car', data)
    if(wx.getStorageSync('car').some(s=>!s.checked)){
      this.setData({
        allchecked:false
      })
    }else{
      this.setData({
        allchecked:true
      })
    }
  },
  guang(){
    wx.switchTab({
      url: '../home/home',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getAllMoney(data){
    console.log(data)
    let allMoney=0
    data.forEach(s=>{
      if(s.checked){
        allMoney+=s.num*s.detail.l_price
      }
    })
    this.setData({
      allMoney:allMoney
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let data=wx.getStorageSync('car')
    if(data){
      if(data.length){
        if(data.some(s=>!s.checked)){
          this.setData({
            allchecked:false
          })
        }else{
          this.setData({
            allchecked:true
          })
        }
        this.setData({
          data:data
        })
        this.getAllMoney(wx.getStorageSync('car'))
      }
    }
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