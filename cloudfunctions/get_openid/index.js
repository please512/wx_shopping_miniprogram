// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

cloud.init({
  env: 'please512-ec4id'
})

// 云函数入口函数
exports.main = async (event, context) => {
  wx.login({
    complete: (res) => {
      return await rp({
        url:`https://api.weixin.qq.com/sns/jscode2session?appid=wx140546d6c36b5d81&secret=c27578c8b0a9ebdd9ca316dc6b1e0e8b&js_code=${res.code}&grant_type=authorization_code`,
        method:'POST',
        body:{},
        headers:{
          'User-Agent': 'Request-Promise'
        },
        json:true
      }).then(function (res) {
        console.log(res)
        return res
      }).catch(function (err) {
        return err
      });
    },
  })
}