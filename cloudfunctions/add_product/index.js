// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

cloud.init({
  env: 'please512-ec4id'
})

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  let query=`db.collection('${event.collectionName}').add({
        data: [{
          description:'此商品出售',
          due: new Date(),
          productName:'${event.productName}',
          tags: [],
          location: new db.Geo.Point(113, 23),
          done: false
        }]
      })`
  return await rp({
    url:`https://api.weixin.qq.com/tcb/databaseadd?access_token=${event.access_token}`,
    method:'POST',
    body:{
      // access_token:event.access_token,
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