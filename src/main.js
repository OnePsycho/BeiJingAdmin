import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import qs from 'qs';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import '../static/css/icon.css';
import '@/assets/iconfont/iconfont.css';
import "babel-polyfill";
import domain from './domain.js';

Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.prototype.$axios.defaults.withCredentials=true;
axios.interceptors.response.use((response) => {
    return response;
}, function (error) {
    if (401 === error.response.status) {
        Vue.prototype.$alert('当前登录状态已过期，请重新登录', '过期通知', {
            confirmButtonText: '确定'
        });
        router.push('/login');
        
    } else {
        return Promise.reject(error);
    }
});

global.domain = domain;


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    if(!role && to.path !== '/login'){
        next('/login');
    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }
    next();
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');