// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

cloud.init({
  env: 'please512-ec4id'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return await rp({
    url:`https://api.weixin.qq.com/tcb/databasecollectionadd?access_token=${event.access_token}`,
    method:'POST',
    body:{
      env:event.env,
      collection_name:event.collection_name
    },
    headers:{
      'User-Agent': 'Request-Promise'
    },
    json:true
  }).then(function (res) {
    return res
  }).catch(function (err) {
    return err
  });
}