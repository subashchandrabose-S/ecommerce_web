<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

import { useCartStore } from '../stores/cart'
const cart = useCartStore()

const addToCart = (product) => {
  cart.addToCart(product)
  alert(`${product.name} added to cart!`)
}
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
        <button @click="addToCart(product)" class="btn btn-primary">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  overflow: hidden;
  transition: var(--transition);
  border-radius: var(--radius-md);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.image-container {
  height: 240px;
  overflow: hidden;
  position: relative;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: var(--text-dark);
}

.description {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  flex: 1;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
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
