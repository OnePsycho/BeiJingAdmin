import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
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
                    path: '/admin',
                    component: resolve => require(['../components/page/BaseAdmin.vue'], resolve),
                    meta: { title: '管理员管理' }
                },{
                    path: '/question',
                    component: resolve => require(['../components/page/BaseQuestion.vue'], resolve),
                    meta: { title: '问题管理' }
                },{
                    path: '/classify',
                    component: resolve => require(['../components/page/BaseClassify.vue'], resolve),
                    meta: { title: '分类管理' }
                },{
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '商品管理' }
                },{
                    path: '/reward',
                    component: resolve => require(['../components/page/BaseReward.vue'], resolve),
                    meta: { title: '赏金管理' }
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
