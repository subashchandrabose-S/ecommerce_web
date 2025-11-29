<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { computed, ref } from 'vue'

const auth = useAuthStore()
const cart = useCartStore()
const isAuthenticated = computed(() => auth.isAuthenticated)
const isAdmin = computed(() => auth.isAdmin)
const mobileMenuOpen = ref(false)

const logout = () => {
  auth.logout()
  mobileMenuOpen.value = false
}

const closeMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav class="navbar glass-panel">
    <div class="container nav-content">
      <RouterLink to="/" class="logo">NurseryEco</RouterLink>
      
      <!-- Hamburger Menu Button -->
      <button class="hamburger" @click="mobileMenuOpen = !mobileMenuOpen">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Desktop Navigation -->
      <div class="nav-links desktop-nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/products/chemical">Chemicals</RouterLink>
        <RouterLink to="/products/nursery">Nursery</RouterLink>
        <RouterLink to="/cart">Cart ({{ cart.totalItems }})</RouterLink>
        
        <div v-if="isAuthenticated" class="auth-links">
          <RouterLink v-if="isAdmin" to="/admin">Admin</RouterLink>
          <button @click="logout" class="btn-text">Logout</button>
        </div>
        <div v-else class="auth-links">
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/admin-login">Admin Login</RouterLink>
          <RouterLink to="/register" class="btn btn-primary">Register</RouterLink>
        </div>
      </div>

      <!-- Mobile Sliding Menu -->
      <div class="mobile-menu" :class="{ 'active': mobileMenuOpen }">
        <RouterLink to="/" @click="closeMenu">Home</RouterLink>
        <RouterLink to="/products/chemical" @click="closeMenu">Chemicals</RouterLink>
        <RouterLink to="/products/nursery" @click="closeMenu">Nursery</RouterLink>
        <RouterLink to="/cart" @click="closeMenu">Cart ({{ cart.totalItems }})</RouterLink>
        
        <div v-if="isAuthenticated" class="mobile-auth-links">
          <RouterLink v-if="isAdmin" to="/admin" @click="closeMenu">Admin Dashboard</RouterLink>
          <button @click="logout" class="btn-text">Logout</button>
        </div>
        <div v-else class="mobile-auth-links">
          <RouterLink to="/login" @click="closeMenu">User Login</RouterLink>
          <RouterLink to="/admin-login" @click="closeMenu">Admin Login</RouterLink>
          <RouterLink to="/register" @click="closeMenu" class="btn btn-primary">Register</RouterLink>
        </div>
      </div>

      <!-- Overlay -->
      <div class="overlay" :class="{ 'active': mobileMenuOpen }" @click="closeMenu"></div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 20px;
  z-index: 100;
  margin: 20px;
  padding: 1rem 0;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  z-index: 110;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 110;
  padding: 0.5rem;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 2px;
  transition: all 0.3s;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--primary-color);
}

.btn-text {
  background: none;
  border: none;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  color: inherit;
}

.btn-text:hover {
  color: var(--primary-color);
}

.mobile-menu {
  display: none;
}

.overlay {
  display: none;
}

@media (max-width: 768px) {
  .navbar {
    top: 0;
    margin: 0;
    border-radius: 0;
    position: fixed;
    width: 100%;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(15px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .nav-content {
    padding: 0.75rem 1rem;
  }
  
  .logo {
    font-size: 1.25rem;
  }
  
  .hamburger {
    display: flex;
  }
  
  .desktop-nav {
    display: none;
  }
  
  .mobile-menu {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 60px;
    left: -100%;
    width: 280px;
    height: calc(100vh - 60px);
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 1.5rem;
    gap: 0.5rem;
    transition: left 0.3s ease-in-out;
    z-index: 109;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
    border-right: 2px solid var(--primary-color);
  }
  
  .mobile-menu.active {
    left: 0;
  }
  
  .mobile-menu a {
    font-weight: 500;
    font-size: 0.95rem;
    padding: 0.875rem 1rem;
    border-radius: 8px;
    background: rgba(74, 222, 128, 0.05);
    transition: all 0.3s;
    display: block;
  }
  
  .mobile-menu a:hover,
  .mobile-menu a.router-link-active {
    background: rgba(74, 222, 128, 0.15);
    color: var(--primary-color);
    transform: translateX(5px);
  }
  
  .mobile-auth-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 2px solid var(--primary-color);
  }
  
  .mobile-auth-links .btn {
    width: 100%;
    text-align: center;
    padding: 0.875rem;
    font-size: 0.95rem;
  }
  
  .mobile-auth-links .btn-text {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    padding: 0.875rem;
    border-radius: 8px;
    width: 100%;
    font-size: 0.95rem;
  }
  
  .overlay {
    display: block;
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    height: calc(100vh - 60px);
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
    z-index: 108;
  }
  
  .overlay.active {
    opacity: 1;
    pointer-events: all;
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 1.1rem;
  }
  
  .mobile-menu {
    width: 240px;
  }
  
  .mobile-menu a {
    font-size: 0.9rem;
    padding: 0.75rem 0.875rem;
  }
}
</style>
