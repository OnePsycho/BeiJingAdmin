// 配置全局接口域名
const domain = 'http://39.104.239.208:9111';
// const domain = 'http://192.168.0.18:8000';
export default {
 apiUrl:domain,
 token:localStorage.getItem('token')
}
