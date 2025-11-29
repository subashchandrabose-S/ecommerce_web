<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  const success = await auth.login(email.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card glass-panel">
      <h2>Welcome Back</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required placeholder="Enter your email" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required placeholder="Enter your password" />
        </div>
        <p v-if="auth.error" class="error">{{ auth.error }}</p>
        <button type="submit" class="btn btn-primary" :disabled="auth.loading">
          {{ auth.loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <p class="switch-auth">
        Don't have an account? <RouterLink to="/register">Register</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem 1rem;
}

.auth-card {
  padding: 3rem;
  width: 100%;
  max-width: 450px;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);
  font-size: 2rem;
}

.form-group {
  margin-bottom: 2rem;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
}

input {
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.7);
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2);
  background: rgba(255, 255, 255, 0.9);
}

.error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border-left: 3px solid #ef4444;
}

button {
  width: 100%;
  padding: 1rem;
  font-size: 1.05rem;
  margin-top: 0.5rem;
}

.switch-auth {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.95rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.switch-auth a {
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
}
</style>
