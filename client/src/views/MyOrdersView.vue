<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import { useAuthStore } from '../stores/auth'

const orders = ref([])
const loading = ref(true)
const auth = useAuthStore()

onMounted(async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/orders/mine`, {
      headers: { 'x-auth-token': auth.token }
    })
    orders.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="my-orders-view">
    <header class="header">
      <h1>My Orders</h1>
    </header>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="orders.length === 0" class="empty-state glass-panel">
      <p>You haven't placed any orders yet.</p>
      <RouterLink to="/" class="btn btn-primary">Start Shopping</RouterLink>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order._id" class="order-card glass-panel">
        <div class="order-header">
            <div>
                <h3>Order #{{ order.orderId || order._id.substr(-6).toUpperCase() }}</h3>
                <span class="date">{{ new Date(order.createdAt).toLocaleDateString() }}</span>
            </div>
            <div class="status">
                <span class="badge" :class="order.status">{{ order.status }}</span>
            </div>
        </div>
        
        <div class="order-items">
            <div v-for="item in order.items" :key="item._id" class="order-item">
                <span>{{ item.name }} x{{ item.quantity }}</span>
                <span>₹{{ item.price * item.quantity }}</span>
            </div>
        </div>

        <div class="order-total">
            <span>Total Amount</span>
            <span>₹{{ order.totalAmount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-orders-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.empty-state {
  text-align: center;
  padding: 3rem;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(0,0,0,0.05);
}

.order-header h3 {
    margin: 0;
    color: var(--primary-color);
}

.date {
    font-size: 0.875rem;
    color: #64748b;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.pending { background: rgba(251, 191, 36, 0.1); color: #d97706; }
.badge.completed { background: rgba(74, 222, 128, 0.1); color: #10b981; }
.badge.cancelled { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.order-items {
    margin-bottom: 1rem;
}

.order-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
}

.order-total {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    font-size: 1.1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(0,0,0,0.1);
}
</style>
