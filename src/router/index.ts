import { createRouter, createWebHistory } from 'vue-router';
import routes from '@/router/routes.ts';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            meta: {
                auth:true
            },
            redirect: '/stories',
            component: () => import('@/layouts/full/FullLayout.vue'),
            children: [
                {
                    name: 'Dashboard',
                    path: '/stories',
                    component: () => import('@/views/dashboard/index.vue')
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/auth/Login.vue'),
            meta: {
                auth:false
            },
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/auth/Register.vue'),
            meta: {
                auth:false
            },
        },
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/pages/Error404.vue')
        },
    ]
});

router.beforeEach(routes);

export default router;