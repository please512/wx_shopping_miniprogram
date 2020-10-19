// components/car/car.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    num:'',
    style:{
      x:-15,
      y:400
    }
  },
  pageLifetimes:{
    show(){
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
    }
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    gotocar(){
      wx.navigateTo({
        url: '../../pages/car/car',
      })
    },
    start(e){
      
    },
    move(e){
      let clientX=parseInt(e.touches[0].clientX)
      let clientY=parseInt(e.touches[0].clientY)
      let windowWidth=wx.getSystemInfoSync().windowWidth
      let windowHeight=wx.getSystemInfoSync().windowHeight
      if((clientX<windowWidth ||clientX==windowWidth) && clientX>-16){
        if((clientY<windowHeight ||clientY==windowHeight) && clientY>25){
          this.setData({
            style:{
              x:clientX-25,
              y:clientY-25
            }
          })
        }
      }
    },
    end(e){
      this.setData({
        style:{
          x:-15,
          y:e.currentTarget.offsetTop
        }
      })
    }
  }
})
