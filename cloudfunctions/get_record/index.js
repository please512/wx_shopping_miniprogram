// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

cloud.init({
  env: 'please512-ec4id'
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.params)
  let query=`db.collection('${event.collectionName}').where(${JSON.stringify(event.params)}).limit(${event.limit}).get()`
  console.log(query)
  return await rp({
    url:`https://api.weixin.qq.com/tcb/databasequery?access_token=${event.access_token}`,
    method:'POST',
    body:{
      env:event.env,
      query:query
    },
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
}