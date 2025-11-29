<script setup>
import { useCartStore } from '../stores/cart'

const cart = useCartStore()

const checkout = () => {
  if (confirm('Proceed to payment? This is a demo, so no real payment will be processed.')) {
    cart.clearCart()
    alert('Order placed successfully! Thank you for shopping with us.')
  }
}

</script>

<template>
  <div class="cart-view">
    <header class="header">
      <h1>Your Shopping Cart</h1>
    </header>

    <div v-if="cart.items.length === 0" class="empty-cart glass-panel">
      <p>Your cart is empty.</p>
      <RouterLink to="/" class="btn btn-primary">Continue Shopping</RouterLink>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items glass-panel">
        <div v-for="item in cart.items" :key="item._id" class="cart-item">
          <img :src="item.image || 'https://via.placeholder.com/100'" :alt="item.name" />
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p>₹{{ item.price }}</p>
          </div>
          <div class="item-actions">
            <input 
              type="number" 
              min="1" 
              :value="item.quantity" 
              @change="cart.updateQuantity(item._id, parseInt($event.target.value))"
            />
            <button @click="cart.removeFromCart(item._id)" class="btn-remove">Remove</button>
          </div>
          <div class="item-total">
            ₹{{ (item.price * item.quantity).toFixed(2) }}
          </div>
        </div>
      </div>

      <div class="cart-summary glass-panel">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Total Items:</span>
          <span>{{ cart.totalItems }}</span>
        </div>
        <div class="summary-row total">
          <span>Total Price:</span>
          <span>₹{{ cart.totalPrice }}</span>
        </div>
        <button @click="checkout" class="btn btn-primary checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-view {
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
  text-align: center;
}

.empty-cart {
  text-align: center;
  padding: 3rem;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.cart-items {
  padding: 1.5rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.cart-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.cart-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-actions input {
  width: 60px;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.1);
}

.btn-remove {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-weight: 500;
}

.item-total {
  font-weight: 700;
  font-size: 1.1rem;
  min-width: 80px;
  text-align: right;
}

.cart-summary {
  padding: 1.5rem;
  height: fit-content;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.total {
  font-weight: 800;
  font-size: 1.25rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0,0,0,0.1);
}

.checkout-btn {
  width: 100%;
  margin-top: 1.5rem;
}
</style>
