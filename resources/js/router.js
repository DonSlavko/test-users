import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './Pages/Home.vue';
import Login from './Pages/Login.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    linkExactActiveClass: 'active',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        }
    ]
});

export default router;
