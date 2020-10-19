// components/layerInput/layerInput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showConfirm:{
      type:Boolean,
      value:false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // isShowConfirm:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    inputchange(e){
      this.triggerEvent('password', { password: e.detail.value })
    },
    cancel(){
      this.triggerEvent('cancel', { })
    },
    confirm(){
      this.triggerEvent('confirm', { })
    }
  }
})
