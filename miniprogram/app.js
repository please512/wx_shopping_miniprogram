//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'please512-ec4id',
        traceUser: true,
      })
      wx.cloud.callFunction({
        name:'login',
        success(res){
          console.log(res.result)
          wx.setStorageSync('openid', res.result.openid)
          wx.setStorageSync('env', res.result.env)
        }
      })
      wx.cloud.callFunction({
        name:'access_token',
        success(res){
          wx.setStorageSync('access_token', JSON.parse(res.result).access_token)
        },
        fail(err){
          console.log(err)
        }
      })
    }
    this.globalData = {
      env:'please512-ec4id'
    }
  },
  //查询用户是否可操作后台
  getRole(){
    return new Promise((resolve,reject)=>{
      wx.showLoading({
        title: '',
      })
      wx.cloud.callFunction({
        name:'get_record',
        data:{
          access_token:wx.getStorageSync('access_token'),
          env:wx.getStorageSync('env'),
          collectionName:'Users',
          limit:1000,
          params:{}
        },
        success(res){
          wx.hideLoading({
            success: (res) => {},
          })
          if(res.result.errcode===0){
            if(res.result.data.length){
              res.result.data.forEach(s=>{
                if(JSON.parse(s).openid===wx.getStorageSync('openid')){
                  if(JSON.parse(s).isAdmin==='1'){
                    resolve(true)
                  }else{
                    resolve(false)
                  }
                }
              })
            }
          }
        },
      })
    })
  },
  tounicode(hanzi){
     if(hanzi == '') return '请输入汉字';
     var str =''; 
     for(var i=0;i<hanzi.length;i++){
        str+="\\u"+parseInt(hanzi[i].charCodeAt(0),10).toString(16);
     }
     console.log('集合改为'+str.replace(/\\/g, "_"))
     return str.replace(/\\/g, "_");
  },
  tohanzi(unicode){
    // if(unicode == '') return '请输入十六进制unicode';
    unicode = unicode.split("_u");
    var str ='';
    for(var i=0;i<unicode.length;i++){
        str+=String.fromCharCode(parseInt(unicode[i],16).toString(10));
    }
    return str.slice(1,str.length);
  }
})
