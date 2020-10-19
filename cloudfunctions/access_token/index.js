// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  let appId='wx140546d6c36b5d81'
  let appSecret='c27578c8b0a9ebdd9ca316dc6b1e0e8b'
  let access_token_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
  return await rp(access_token_url).then(function (res) {
      return res
    }).catch(function (err) {
      return err
    });
}