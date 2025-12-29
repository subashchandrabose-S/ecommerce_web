import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

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
        },
        {
            path: '/my-orders',
            name: 'my-orders',
            component: () => import('../views/MyOrdersView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/payment/:id',
            name: 'payment',
            component: () => import('../views/PaymentView.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()

    // If we have a token but no user info, try to fetch it first
    if (auth.token && !auth.user) {
        await auth.fetchUser()
    }

    // If route requires auth
    if (to.meta.requiresAuth) {
        if (!auth.isAuthenticated) {
            // Redirect to appropriate login
            if (to.meta.requiresAdmin) {
                return next('/admin-login')
            }
            return next('/login')
        }

        // If route requires admin
        if (to.meta.requiresAdmin && !auth.isAdmin) {
            return next('/')
        }
    }

    next()
})

export default router
