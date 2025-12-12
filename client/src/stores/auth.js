import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin'
    },
    actions: {
        async login(email, password) {
            this.loading = true
            try {
                const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password })
                this.token = res.data.token
                this.user = res.data.user
                localStorage.setItem('token', this.token)
                this.error = null
                return true
            } catch (err) {
                this.error = err.response?.data?.message || 'Login failed'
                return false
            } finally {
                this.loading = false
            }
        },
        async fetchUser() {
            if (!this.token) return
            try {
                const res = await axios.get(`${API_BASE_URL}/auth/user`, {
                    headers: { 'x-auth-token': this.token }
                })
                this.user = res.data
            } catch (err) {
                console.error(err)
                this.logout()
            }
        },
        async register(name, email, password, mobile, role = 'user') {
            this.loading = true
            try {
                const res = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password, mobile, role })
                this.token = res.data.token
                this.user = res.data.user
                localStorage.setItem('token', this.token)
                this.error = null
                return true
            } catch (err) {
                this.error = err.response?.data?.message || 'Registration failed'
                return false
            } finally {
                this.loading = false
            }
        },
        logout() {
            this.token = null
            this.user = null
            localStorage.removeItem('token')
        }
    }
})
