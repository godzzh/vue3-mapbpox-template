import { createRouter, createWebHashHistory } from 'vue-router';

import { appConfig } from '@/config';
import { useUserStore } from '@/stores/user';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'Login',
            meta: { title: '用户登录', public: true },
            component: () => import('@/views/Login/index.vue'),
        },
        {
            path: '/',
            component: () => import('@/views/MapScreen/index.vue'),
            children: [
                { path: '', redirect: '/home' },
                {
                    path: 'home',
                    name: 'HomeDashboard',
                    meta: { title: '首页', menuId: 'home' },
                    component: () => import('@/views/Home/index.vue'),
                },
                {
                    path: 'situation',
                    name: 'SituationDashboard',
                    meta: { title: '态势感知', menuId: 'situation' },
                    component: () => import('@/views/Situation/index.vue'),
                },
                {
                    path: 'operation',
                    name: 'RiskOperation',
                    meta: { title: '风险作战', menuId: 'operation' },
                    component: () => import('@/views/Operation/index.vue'),
                },
                {
                    path: 'dispatch',
                    name: 'ResourceDispatch',
                    meta: { title: '资源调度', menuId: 'dispatch' },
                    component: () => import('@/views/Dispatch/index.vue'),
                },
            ],
        },
        { path: '/:pathMatch(.*)*', redirect: '/home' },
    ],
});

router.beforeEach(async (to) => {
    const title = typeof to.meta.title === 'string' ? to.meta.title : '';
    const platformTitle = appConfig.platform.title;
    document.title = title ? `${title} - ${platformTitle}` : platformTitle;

    const queryToken = [to.query.token, to.query.Token, to.query.TOKEN].find(
        (value): value is string => typeof value === 'string' && Boolean(value),
    );
    const userStore = useUserStore();
    if (queryToken) userStore.setToken(queryToken);

    if (to.meta.public) {
        if (to.name === 'Login' && userStore.isAuthenticated) return { path: '/home', replace: true };
        return true;
    }

    if (!userStore.isAuthenticated) {
        return { name: 'Login', query: { redirect: to.fullPath }, replace: true };
    }
    if (!userStore.userInfo && !(await userStore.loadUserInfo())) {
        userStore.clearSession();
        return { name: 'Login', query: { redirect: to.fullPath }, replace: true };
    }
    return true;
});

export default router;
