// components/imgShow/imgShow.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrl:{
      type:String,
      value:''
    },
    imgShow:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    layClick(){
      this.triggerEvent('close', '')
    },
    close(){
      this.triggerEvent('close', '')
    },
  }
})
