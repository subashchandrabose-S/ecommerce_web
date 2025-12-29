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
  <nav class="navbar glass-panel" role="navigation">
    <div class="container nav-content">
      <RouterLink to="/" class="logo" @click="closeMenu">NurseryEco</RouterLink>
      
      <!-- Hamburger Menu Button (Mobile Only) -->
      <button 
        type="button"
        class="hamburger" 
        @click="mobileMenuOpen = !mobileMenuOpen" 
        :class="{ 'active': mobileMenuOpen }" 
        aria-label="Toggle navigation menu"
        aria-controls="mobile-menu"
        :aria-expanded="mobileMenuOpen.toString()"
        >
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
      <div id="mobile-menu" class="mobile-menu" :class="{ 'active': mobileMenuOpen }">
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
/* Base Navbar Styles */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  padding: 0.75rem 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.logo {
  font-size: 1.85rem;
  letter-spacing: -0.5px;
  font-weight: 900;
  color: var(--primary-color);
  z-index: 110;
  transition: transform 0.2s;
}

.logo:hover {
  transform: scale(1.05);
}

/* Hamburger Menu */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 110;
  padding: 0.5rem;
  transition: transform 0.3s;
}

.hamburger:hover {
  transform: scale(1.1);
}

/* Focus outlines for accessibility */
.hamburger:focus,
.nav-links a:focus,
.btn-text:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* Desktop Navigation */
.nav-links {
  display: flex;
  gap: 2.5rem;
  align-items: center;
}

.nav-links a {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-dark);
  padding: 0.5rem 0;
  position: relative;
  transition: var(--transition);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-color);
  transition: var(--transition);
}

.nav-links a:hover::after,
.nav-links a.router-link-active::after {
  width: 100%;
}

.nav-links a:hover {
  color: var(--primary-color);
}

.auth-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-text {
  background: none;
  border: none;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  color: inherit;
  transition: all 0.3s;
}

.btn-text:hover {
  color: var(--primary-color);
}

/* Mobile Menu - Hidden by default */
.mobile-menu {
  display: none;
}

.overlay {
  display: none;
}

/* Responsive Breakpoints */

/* Tablet and Mobile (< 768px) */
@media (max-width: 768px) {
  .navbar {
    top: 0;
    margin: 0;
    border-radius: 0;
    position: fixed;
    width: 100%;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  }
  
  .nav-content {
    padding: 0.875rem 1.25rem;
  }
  
  .logo {
    font-size: 1.35rem;
  }
  
  /* Show hamburger on mobile */
  .hamburger {
    display: flex;
  }
  
  /* Hide desktop nav on mobile */
  .desktop-nav {
    display: none;
  }
  
  /* Mobile Menu Styles */
  .mobile-menu {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 65px;
    right: -100%;
    width: 300px;
    max-width: 85vw;
    height: calc(100vh - 65px);
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    padding: 2rem 1.5rem;
    gap: 0.75rem;
    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 109;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
    border-left: 3px solid var(--primary-color);
  }
  
  .mobile-menu.active {
    right: 0;
  }
  
  .mobile-menu a {
    font-weight: 500;
    font-size: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 10px;
    background: rgba(74, 222, 128, 0.08);
    transition: all 0.3s ease;
    display: block;
    position: relative;
    overflow: hidden;
  }
  
  .mobile-menu a::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: var(--primary-color);
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }
  
  .mobile-menu a:hover,
  .mobile-menu a.router-link-active {
    background: rgba(74, 222, 128, 0.18);
    color: var(--primary-color);
    transform: translateX(8px);
  }
  
  .mobile-menu a:hover::before,
  .mobile-menu a.router-link-active::before {
    transform: scaleY(1);
  }
  
  .mobile-auth-links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 2px solid rgba(74, 222, 128, 0.3);
  }
  
  .mobile-auth-links .btn {
    width: 100%;
    text-align: center;
    padding: 1rem;
    font-size: 1rem;
  }
  
  .mobile-auth-links .btn-text {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    padding: 1rem;
    border-radius: 10px;
    width: 100%;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .mobile-auth-links .btn-text:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #dc2626;
  }
  
  /* Overlay */
  .overlay {
    display: block;
    position: fixed;
    top: 65px;
    left: 0;
    width: 100%;
    height: calc(100vh - 65px);
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease;
    z-index: 108;
  }
  
  .overlay.active {
    opacity: 1;
    pointer-events: all;
  }
}

/* Small Mobile (< 480px) */
@media (max-width: 480px) {
  .logo {
    font-size: 1.15rem;
  }
  
  .mobile-menu {
    width: 280px;
    padding: 1.5rem 1.25rem;
  }
  
  .mobile-menu a {
    font-size: 0.95rem;
    padding: 0.875rem 1rem;
  }
  
  .hamburger span {
    width: 22px;
  }
}

/* Large Desktop (> 1200px) */
@media (min-width: 1200px) {
  .nav-links {
    gap: 2.5rem;
  }
  
  .logo {
    font-size: 1.75rem;
  }
}

/* Dark mode support for glass panels */
@media (prefers-color-scheme: dark) {
  .navbar {
    background: rgba(30, 30, 30, 0.8);
  }
  
  .mobile-menu {
    background: rgba(30, 30, 30, 0.95);
  }
}
</style>
