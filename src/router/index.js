import { createRouter, createWebHistory } from 'vue-router';
const Login = () => import('@/components/Login.vue');

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        name: 'main',
        component: () => import('@/views/Main.vue'),
        redirect: "/home",
        children: [
            {
                path: 'home',
                name: 'home',
                component: () => import('@/views/Home.vue')
            },
            {
                path: 'user',
                name: 'user',
                component: () => import('@/views/User.vue')
            },
            {
              path: 'order',
              name: 'order',
              component: () => import('@/views/Order.vue')
          },
          {
            path: 'service',
            name: 'service',
            component: () => import('@/views/Service.vue')
        },
        ]
    },
];

const router = createRouter({
    mode: "history",
    history: createWebHistory(),
    routes
});

/* router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token');
    if (to.path.startsWith('/main') &&!isAuthenticated) {
        next('/login');
    } else {
        next();
    }
}); */

export default router;