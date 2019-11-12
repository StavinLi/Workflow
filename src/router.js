import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        redirect: '/approval/setting'
    }, {
        path: '/approval/setting',
        name: 'approval',
        component: (resolve) => {
            require([`@/views/approval/setting`], resolve)
        }
    }]
})