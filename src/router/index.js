import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: '/application/g01jfsc_zk65m/web/',
    routes: [
        {
            path: '/',
            redirect: '/user'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve), // vue-router懒加载
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/user',
                    component: resolve => require(['../components/page/BaseUser.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/classify',
                    component: resolve => require(['../components/page/BaseClassify.vue'], resolve),
                    meta: { title: '分类管理' }
                },{
                    path: '/area',
                    component: resolve => require(['../components/page/BaseArea.vue'], resolve),
                    meta: { title: '专区管理' }
                },{
                    path: '/slider',
                    component: resolve => require(['../components/page/BaseSlider.vue'], resolve),
                    meta: { title: '轮播管理' }
                },{
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '商品管理' }
                },
                {
                    path: '/exchange',
                    component: resolve => require(['../components/page/BaseExchange.vue'], resolve),
                    meta: { title: '兑换管理' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
