<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'

const auth = useAuthStore()

onMounted(() => {
  if (auth.token) {
    auth.fetchUser()
  }
})
</script>

<template>
  <Navbar />
  <main class="container">
    <RouterView />
  </main>
</template>

<style scoped>
main {
  padding: 2rem 0;
}

@media (max-width: 768px) {
  main {
    padding-top: 80px;
  }
}
</style>
