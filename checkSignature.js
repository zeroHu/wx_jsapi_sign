// checkSignature.js
/**
 * 整个验证步骤分为三步
 *    1. 将token、timestamp、nonce三个参数进行字典序排序
 *    2. 将三个参数字符串拼接成一个字符串进行sha1加密
 *    3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
 */
const http = require('http');
const url = require('url');
const crypto = require('crypto');
// Web 服务器端口
const port = 3020;
// 微信公众平台服务器配置中的 Token
const token = 'thisisthejszeroyhcntokenonly';
/**
 *  对字符串进行sha1加密
 * @param  {string} str 需要加密的字符串
 * @return {string}     加密后的字符串
 */
function sha1(str) {
  const md5sum = crypto.createHash('sha1');
  md5sum.update(str);
  const ciphertext = md5sum.digest('hex');
  return ciphertext;
}
/**
 * 验证服务器的有效性
 * @param  {object} req http 请求
 * @param  {object} res http 响应
 * @return {object}     验证结果
 */
function checkSignature(req, res) {
  const query = url.parse(req.url, true).query;
  console.log('Request URL: ', req.url);
  const signature = query.signature;
  const timestamp = query.timestamp;
  const nonce = query.nonce;
  const echostr = query.echostr;
  console.log('timestamp: ', timestamp);
  console.log('nonce: ', nonce);
  console.log('signature: ', signature);
  // 将 token/timestamp/nonce 三个参数进行字典序排序
  const tmpArr = [token, timestamp, nonce];
  const tmpStr = sha1(tmpArr.sort().join(''));
  console.log('Sha1 String: ', tmpStr);
  // 验证排序并加密后的字符串与 signature 是否相等
  if (tmpStr === signature) {
    // 原样返回echostr参数内容
    res.end(echostr);
    console.log('Check Success');
  } else {
    res.end('failed');
    console.log('Check Failed');
  }
}
const server = http.createServer(checkSignature)
server.listen(port, () => {
  console.log(`Server is runnig ar port ${port}`);
  console.log('Start Checking...');
});
