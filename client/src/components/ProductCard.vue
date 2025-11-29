<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

import { useCartStore } from '../stores/cart'
const cart = useCartStore()
</script>

<template>
  <div class="product-card glass-panel">
    <div class="image-container">
      <img :src="product.image || 'https://via.placeholder.com/300'" :alt="product.name" />
    </div>
    <div class="content">
      <h3>{{ product.name }}</h3>
      <p class="description">{{ product.description }}</p>
      <div class="footer">
        <span class="price">₹{{ product.price }}</span>
        <button @click="cart.addToCart(product)" class="btn btn-primary">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  overflow: hidden;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.image-container {
  height: 200px;
  overflow: hidden;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  padding: 1.5rem;
}

h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.description {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
}

.btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

@media (max-width: 480px) {
  .product-card {
    border-radius: 12px;
  }
  
  .image-container {
    height: 140px;
  }
  
  .content {
    padding: 1rem;
  }
  
  h3 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  
  .description {
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
    -webkit-line-clamp: 2;
  }
  
  .footer {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .price {
    font-size: 1.1rem;
  }
  
  .btn {
    width: 100%;
    padding: 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
