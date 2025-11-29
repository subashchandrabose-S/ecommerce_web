<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
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
