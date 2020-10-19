// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

cloud.init({
  env: 'please512-ec4id'
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.record)
  let query=`db.collection('${event.collectionName}').add({
        data: [${JSON.stringify(event.record)}]
      })`
  console.log(query)
  return await rp({
    url:`https://api.weixin.qq.com/tcb/databaseadd?access_token=${event.access_token}`,
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
    return res
  }).catch(function (err) {
    return err
  });
}