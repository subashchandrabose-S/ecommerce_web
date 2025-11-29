import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/admin-login',
            name: 'admin-login',
            component: () => import('../views/AdminLoginView.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterView.vue')
        },
        {
            path: '/products/chemical',
            name: 'chemical-products',
            component: () => import('../views/ProductListView.vue'),
            props: { category: 'Chemical' }
        },
        {
            path: '/products/nursery',
            name: 'nursery-products',
            component: () => import('../views/ProductListView.vue'),
            props: { category: 'Nursery' }
        },
        {
            path: '/category/:subCategory',
            name: 'category',
            component: () => import('../views/CategoryView.vue')
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('../views/AdminDashboardView.vue'),
            meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
            path: '/cart',
            name: 'cart',
            component: () => import('../views/CartView.vue')
        }
    ]
})

export default router
