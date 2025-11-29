<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import ProductCard from '../components/ProductCard.vue'

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

const products = ref([])
const loading = ref(true)

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${API_BASE_URL}/products`)
    // Filter by category
    products.value = res.data.filter(p => p.category === props.category)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)
watch(() => props.category, fetchProducts)
</script>

<template>
  <div class="product-list">
    <header class="header">
      <h1>{{ category }} Products</h1>
      <p>Explore our collection of {{ category.toLowerCase() }} items.</p>
    </header>

    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="products.length === 0" class="empty">
      <p>No products found in this category.</p>
    </div>

    <div v-else class="grid">
      <ProductCard v-for="product in products" :key="product._id" :product="product" />
    </div>
  </div>
</template>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.loading, .empty {
  text-align: center;
  padding: 3rem;
  font-size: 1.25rem;
  color: #64748b;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .header {
    margin-bottom: 2rem;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.75rem;
  }
  
  .header p {
    font-size: 0.95rem;
  }
}
</style>

