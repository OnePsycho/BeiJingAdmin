// 配置全局接口域名
const domain = 'http://39.104.239.208:9111';
const imgDomain = 'http://39.104.239.208';
// const domain = 'http://192.168.0.18:8000';
export default {
 apiUrl:domain,
 apiImgUrl:imgDomain,
 token:localStorage.getItem('token')
}
