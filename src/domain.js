// 配置全局接口域名
// const domain = 'http://39.104.239.208:9111';
const imgDomain = 'http://39.104.239.208';
 const domain = 'http://test.frp.rongyaotech.com';
export default {
 apiUrl:domain,
 apiImgUrl:imgDomain,
 token:localStorage.getItem('token')
}
