<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const products = ref([])
const loading = ref(true)
const categoryName = ref('')

const categoryInfo = {
  indoor: {
    title: 'Indoor Plants',
    icon: '🪴',
    description: 'Beautiful plants perfect for your home and office spaces'
  },
  outdoor: {
    title: 'Outdoor Plants',
    icon: '🌻',
    description: 'Stunning plants for your garden and outdoor areas'
  },
  medicine: {
    title: 'Medicine Plants',
    icon: '💊',
    description: 'Natural healing plants for wellness and health'
  }
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${API_BASE_URL}/products`)
    const subCat = route.params.subCategory
    categoryName.value = subCat
    
    // Filter by subcategory
    products.value = res.data.filter(p => 
      p.subCategory && p.subCategory.toLowerCase() === subCat.toLowerCase()
    )
    console.log(`Loaded ${products.value.length} products for category: ${subCat}`)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)
</script>

<template>
  <div class="category-view">
    <header class="category-header glass-panel">
      <div class="header-content">
        <div class="category-icon-large">{{ categoryInfo[categoryName]?.icon }}</div>
        <h1>{{ categoryInfo[categoryName]?.title }}</h1>
        <p>{{ categoryInfo[categoryName]?.description }}</p>
      </div>
    </header>

    <div v-if="loading" class="loading">Loading products...</div>
    
    <div v-else-if="products.length === 0" class="empty glass-panel">
      <p>No products found in this category yet.</p>
      <RouterLink to="/" class="btn btn-primary">Back to Home</RouterLink>
    </div>

    <div v-else class="products-grid">
      <ProductCard v-for="product in products" :key="product._id" :product="product" />
    </div>
  </div>
</template>

<style scoped>
.category-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.category-header {
  text-align: center;
  padding: 3rem 2rem;
  margin-bottom: 3rem;
}

.category-icon-large {
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.category-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.category-header p {
  font-size: 1.2rem;
  color: #64748b;
}

.loading {
  text-align: center;
  padding: 4rem;
  font-size: 1.25rem;
  color: #64748b;
}

.empty {
  text-align: center;
  padding: 4rem 2rem;
}

.empty p {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

@media (max-width: 768px) {
  .category-header h1 {
    font-size: 2rem;
  }
  
  .category-icon-large {
    font-size: 4rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}
</style>
