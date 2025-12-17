<script setup>
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue' // Added missing imports
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()

const userDetails = ref({
  fullName: auth.user?.name || '',
  phoneNumber: auth.user?.mobile || '',
  shippingAddress: ''
})

// Update user details if auth.user loads later
watch(() => auth.user, (newVal) => {
  if (newVal) {
    userDetails.value.fullName = newVal.name || ''
    userDetails.value.phoneNumber = newVal.mobile || ''
  }
}, { immediate: true })

const checkout = async () => {
  if (!auth.isAuthenticated) {
    if (confirm('Please login to complete your purchase. Proceed to login?')) {
        router.push({ name: 'login', query: { redirect: 'cart' } })
    }
    return
  }

  // Validate User Details
  if (!userDetails.value.fullName || !userDetails.value.phoneNumber || !userDetails.value.shippingAddress) {
      alert('Please fill in all shipping details before proceeding.')
      return
  }

  if (confirm('Confirm order payment of ₹' + cart.totalPrice + '?')) {
    try {
        const res = await axios.post(`${API_BASE_URL}/orders`, {
            items: cart.items.map(item => ({
                product: item._id, // Assuming item._id is the product ID
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            totalAmount: cart.totalPrice,
            fullName: userDetails.value.fullName,
            phoneNumber: userDetails.value.phoneNumber,
            shippingAddress: userDetails.value.shippingAddress
        }, {
            headers: { 'x-auth-token': auth.token }
        })

        cart.clearCart()
        // Determine order ID to redirect
        const orderId = res.data._id
        // router.push('/my-orders') 
        router.push(`/payment/${orderId}`)
    } catch (err) {
        console.error(err)
        alert('Failed to place order. Please try again.')
    }
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
            ₹{{ (item.price * item.quantity ).toFixed(2) }}
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
        
        <div class="user-details-form">
          <h4>Shipping Details</h4>
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" v-model="userDetails.fullName" placeholder="Enter your name" required />
          </div>
          <div class="form-group">
             <label for="phoneNumber">Phone Number</label>
             <input type="tel" id="phoneNumber" v-model="userDetails.phoneNumber" placeholder="Enter phone number" required />
          </div>
          <div class="form-group">
            <label for="shippingAddress">Shipping Address</label>
            <textarea id="shippingAddress" v-model="userDetails.shippingAddress" rows="3" placeholder="Enter delivery address" required></textarea>
          </div>
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

.user-details-form {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0,0,0,0.1);
  text-align: left;
}

.user-details-form h4 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4b5563;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .cart-item img {
    width: 100%;
    height: 200px;
  }

  .item-actions {
    width: 100%;
    justify-content: space-between;
  }

  .item-total {
    text-align: left;
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>
