// miniprogram/pages/product_detail/product_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    productImgs:[],
    num:0,
    imgShow:false,
    imgUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      detail:options
    })
    this.getImages()
  },
  seeProduct(e){
    this.setData({
      imgShow:true,
      imgUrl:e.currentTarget.dataset.url
    })
  },
  close(){
    this.setData({
      imgShow:false,
      imgUrl:''
    })
  },
  car(){
    wx.navigateTo({
      url: '../../pages/car/car',
    })
  },
  join(){
    console.log(this.data.detail)
    let car=[]
    if(wx.getStorageSync('car')){
      console.log(wx.getStorageSync('car'))
      let car=wx.getStorageSync('car')
      console.log(car.filter(s=>s.detail._id===this.data.detail._id).length)
      if(car.filter(s=>s.detail._id===this.data.detail._id).length){
        let has=car.filter(s=>s.detail._id===this.data.detail._id)[0]
        console.log(has)
        car.forEach(s=>{
          if(s.detail._id===has.detail._id){
            s.num++
          }
        })
        let num=0
        car.forEach(s=>{
          num+=s.num
        })
        this.refreshNum(num)
        wx.setStorageSync('car', car)
        wx.showToast({
          title: '添加成功',
        })
      }else{
        let car=wx.getStorageSync('car')
        car.push({
          num:1,
          checked:true,
          detail:this.data.detail
        })
        wx.setStorageSync('car', car)
        wx.showToast({
          title: '添加成功',
        })
        let num=0
        wx.getStorageSync('car').forEach(s=>{
          num+=s.num
        })
        this.refreshNum(num)
      }
    }else{
      wx.setStorageSync('car', [{
        num:1,
        checked:true,
        detail:this.data.detail
      }])
      wx.showToast({
        title: '添加成功',
      })
      this.refreshNum(1)
    }
  },
  refreshNum(num){
    this.setData({
      num:num
    })
  },
  getImages(){
    let detail=this.data.detail
    let productImgs=[]
    if(detail.tempFileURL1){
      productImgs.push(detail.tempFileURL1)
    }
    if(detail.tempFileURL2){
      productImgs.push(detail.tempFileURL2)
    }
    if(detail.tempFileURL3){
      productImgs.push(detail.tempFileURL3)
    }
    this.setData({
      productImgs:productImgs
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
    console.log(wx.getStorageSync('car'))
    if(wx.getStorageSync('car')){
      if(wx.getStorageSync('car').length){
        let num=0
        wx.getStorageSync('car').forEach(s=>{
          num+=s.num
        })
        this.setData({
          num:num
        })
      }else{
        this.setData({
          num:0
        })
      }
    }else{
      this.setData({
        num:0
      })
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