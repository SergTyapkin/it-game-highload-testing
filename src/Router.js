import { createRouter, createWebHistory } from 'vue-router'

import Registration from "./views/User/Registration.vue";
import Login from "./views/User/Login.vue";
import Profile from "./views/User/Profile.vue";
import ChangePassword from "./views/User/ChangePassword.vue";
import Page404 from "./views/Page404.vue";
import RestorePassword from "./views/User/RestorePassword.vue";
import PageMap from "~/views/PageMap.vue";

const BASE_PART = '/it-game-highload-testing/';

export default function createVueRouter(Store) {
    const routes = [
        {path: BASE_PART + '/', name: 'default', component: PageMap, meta: {}},

        {path: BASE_PART + '/register', name: 'register', component: Registration, meta: {noLoginRequired: true}},
        {path: BASE_PART + '/login', name: 'login', component: Login, meta: {noLoginRequired: true}},
        {path: BASE_PART + '/login/email', name: 'signInByEmail', component: Login, meta: {noLoginRequired: true}},
        {path: BASE_PART + '/profile', name: 'profile', component: Profile, meta: {loginRequired: true}},
        {path: BASE_PART + '/password/change', name: 'changePassword', component: ChangePassword, meta: {loginRequired: true}},
        {path: BASE_PART + '/password/restore', name: 'restorePassword', component: RestorePassword, meta: {noLoginRequired: true}},
        // {path: '/admin', name: 'admin', component: Admin, meta: {adminRequired: true}},

        {path: BASE_PART + '/:pathMatch(.*)*', name: 'page404', component: Page404},
    ];

    const Router = createRouter({
        history: createWebHistory(),
        routes: routes,
    });

    let router_got_user = false;
    Router.beforeEach(async (to, from, next) => {
        // if (!router_got_user) {
        //     await Store.dispatch('GET_USER');
        //     router_got_user = true;
        // }

        const notLoginedRedirect = {
            name: 'login'
        }
        const loginedRedirect = {
            name: 'profile',
        }

        // if (to.path === '/' || to.path === '') {
        //     if (Store.state.user.isSignedIn) {
        //         next(loginedRedirect);
        //         return;
        //     }
        //     next(notLoginedRedirect);
        //     return;
        // }

        // Login required redirects
        if (to.matched.some(record => record.meta.loginRequired === true || record.meta.adminRequired === true)) {
            if (Store.state.user.isSignedIn) {
                next();
                return;
            }
            next(notLoginedRedirect);
            return;
        } else if (to.matched.some(record => record.meta.noLoginRequired === true)) {
            if (!Store.state.user.isSignedIn) {
                next();
                return;
            }
            next(loginedRedirect);
            return;
        }
        if (to.matched.some(record => record.meta.adminRequired === true)) {
            if (Store.state.user.isAdmin) {
                next();
                return;
            }
            next(loginedRedirect);
            return;
        }
        next();
    });

    Router.beforeResolve(async (to) => {
        if (window?.onbeforeunload) {
            if (confirm("Изменения не сохранены. Вы уверены, что хотите покинуть страницу?"))
                window.onbeforeunload = null;
            else
                return false;
        }
    });

    return Router;
}
