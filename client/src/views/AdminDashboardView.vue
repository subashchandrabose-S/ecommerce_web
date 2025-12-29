<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import { useAuthStore } from '../stores/auth'
import * as XLSX from 'xlsx'

const totalRevenue = computed(() => {
  return orders.value
    .filter(o => o.status === 'completed')
    .reduce((acc, curr) => acc + curr.totalAmount, 0)
})

const completedOrdersCount = computed(() => {
  return orders.value.filter(o => o.status === 'completed').length
})

const products = ref([])
const users = ref([])
const orders = ref([])
const userStats = ref([])
const loading = ref(true)
const showForm = ref(false)
const activeTab = ref('orders') // 'products', 'users', 'stats', 'orders'
const auth = useAuthStore()

const form = ref({
  name: '',
  description: '',
  price: 0,
  category: 'Nursery',
  image: '',
  stock: 0
})

const fetchProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/products`)
    products.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const fetchUsers = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/admin/users`, { headers: { 'x-auth-token': auth.token } })
    users.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const fetchUserStats = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/admin/user-stats`, { headers: { 'x-auth-token': auth.token } })
    userStats.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchOrders = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/admin/orders`, { headers: { 'x-auth-token': auth.token } })
    orders.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const exportOrders = () => {
  const data = orders.value.map(order => {
    const customerName = order.fullName || order.user?.name || 'Unknown'
    const firstLetter = customerName.charAt(0).toUpperCase()
    // Ensure orderId exists, fallback to slice of _id if not (though model generates it)
    const orderIdNum = order.orderId || order._id.slice(-5).toUpperCase()
    const customOrderId = `${firstLetter}${orderIdNum}`
    
    return {
      'Order ID': customOrderId,
      'Customer Name': customerName,
      'Phone': order.phoneNumber,
      'Shipping Address': order.shippingAddress,
      'Date': new Date(order.createdAt).toLocaleDateString(),
      'Items': order.items.map(i => `${i.name} x${i.quantity}`).join(', '),
      'Total': order.totalAmount,
      'Status': order.status
    }
  })

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data)
  // Create workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Orders")
  // Save file
  XLSX.writeFile(wb, "customer_orders.xlsx")
}

const updateOrderStatus = async (id, status) => {
  try {
    await axios.put(`${API_BASE_URL}/admin/orders/${id}`, { status }, { headers: { 'x-auth-token': auth.token } })
    // Update local state to reflect change immediately (or re-fetch)
    const order = orders.value.find(o => o._id === id)
    if (order) order.status = status
    // Optional: Show success feedback
  } catch (err) {
    console.error(err)
    alert('Failed to update status')
  }
}

const handleSubmit = async () => {
  try {
    await axios.post(`${API_BASE_URL}/products`, form.value, { headers: { 'x-auth-token': auth.token } })
    await fetchProducts()
    showForm.value = false
    form.value = {
      name: '',
      description: '',
      price: 0,
      category: 'Nursery',
      image: '',
      stock: 0
    }
  } catch (err) {
    console.error(err)
    alert('Failed to create product')
  }
}

const deleteProduct = async (id) => {
  if (!confirm('Are you sure?')) return
  try {
    await axios.delete(`${API_BASE_URL}/products/${id}`, { headers: { 'x-auth-token': auth.token } })
    await fetchProducts()
  } catch (err) {
    console.error(err)
    alert('Failed to delete product')
  }
}

onMounted(async () => {
  await fetchProducts()
  await fetchUsers()
  await fetchUserStats()
  await fetchOrders()
})
</script>

<template>
  <div class="admin-dashboard container animate-fade">
    <header class="header">
      <h1>Admin Dashboard</h1>
      <button v-if="activeTab === 'products'" @click="showForm = !showForm" class="btn btn-primary">
        {{ showForm ? 'Cancel' : 'Add New Product' }}
      </button>
      <button v-if="activeTab === 'orders'" @click="exportOrders" class="btn btn-secondary">
        Export to Excel
      </button>
    </header>

    <!-- Stats Overview -->
    <div class="stats-overview animate-fade">
      <div class="stat-card glass-panel">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <p>Total Revenue</p>
          <h3>₹{{ totalRevenue.toLocaleString() }}</h3>
        </div>
      </div>
      <div class="stat-card glass-panel">
        <div class="stat-icon">📦</div>
        <div class="stat-info">
          <p>Completed Orders</p>
          <h3>{{ completedOrdersCount }}</h3>
        </div>
      </div>
      <div class="stat-card glass-panel">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <p>Total Users</p>
          <h3>{{ users.length }}</h3>
        </div>
      </div>
      <div class="stat-card glass-panel">
        <div class="stat-icon">🌱</div>
        <div class="stat-info">
          <p>Live Products</p>
          <h3>{{ products.length }}</h3>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button @click="activeTab = 'orders'" :class="{ active: activeTab === 'orders' }">
        Orders ({{ orders.length }})
      </button>
      <button @click="activeTab = 'products'" :class="{ active: activeTab === 'products' }">
        Products ({{ products.length }})
      </button>
      <button @click="activeTab = 'users'" :class="{ active: activeTab === 'users' }">
        Users ({{ users.length }})
      </button>
      <button @click="activeTab = 'stats'" :class="{ active: activeTab === 'stats' }">
        User Activity
      </button>
    </div>

    <!-- Orders Management -->
     <div v-show="activeTab === 'orders'">
      <div class="products-table glass-panel">
        <h3>Customer Orders</h3>
        <div v-if="orders.length === 0" class="empty-state">
          <p>No orders found</p>
        </div>
        <div v-else class="table-responsive">
          <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Shipping Details</th>
              <th>Date</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order._id">
              <td>
                <span class="badge" style="background: rgba(99, 102, 241, 0.1); color: #6366f1;">
                  {{ order.orderId || order._id.substr(-6).toUpperCase() }}
                </span>
              </td>
              <td>
                <div style="font-weight: 500;">{{ order.fullName || order.user?.name || 'Unknown' }}</div>
                <div style="font-size: 0.8em; color: gray;">{{ order.phoneNumber }}</div>
              </td>
              <td style="font-size: 0.9em; max-width: 200px;">
                {{ order.shippingAddress }}
              </td>
              <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
              <td>
                <div v-for="item in order.items" :key="item._id" style="font-size: 0.9em; margin-bottom: 4px;">
                  {{ item.name }} x{{ item.quantity }}
                </div>
              </td>
              <td style="font-weight: 600;">₹{{ order.totalAmount }}</td>
              <td>
                <span class="badge" :class="order.status">{{ order.status }}</span>
              </td>
              <td>
                <select 
                  :value="order.status" 
                  @change="updateOrderStatus(order._id, $event.target.value)"
                  class="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Product Management -->
    <div v-show="activeTab === 'products'">
      <div v-if="showForm" class="form-container glass-panel">
        <h3>Add Product</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-grid">
            <div class="form-group">
              <label>Name</label>
              <input v-model="form.name" required />
            </div>
            <div class="form-group">
              <label>Category</label>
              <select v-model="form.category">
                <option value="Nursery">Nursery</option>
                <option value="Chemical">Chemical</option>
              </select>
            </div>
            <div class="form-group">
              <label>Price</label>
              <input v-model="form.price" type="number" required />
            </div>
            <div class="form-group">
              <label>Stock</label>
              <input v-model="form.stock" type="number" required />
            </div>
            <div class="form-group full-width">
              <label>Description</label>
              <textarea v-model="form.description" rows="3"></textarea>
            </div>
            <div class="form-group full-width">
              <label>Image URL</label>
              <input v-model="form.image" placeholder="https://example.com/plant.jpg" />
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Save Product</button>
        </form>
      </div>

      <div class="products-table glass-panel">
        <div class="table-responsive">
          <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product._id">
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>₹{{ product.price }}</td>
              <td>{{ product.stock }}</td>
              <td>
                <button @click="deleteProduct(product._id)" class="btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>

    <!-- User Management -->
    <div v-show="activeTab === 'users'">
      <div class="products-table glass-panel">
        <h3>Registered Users</h3>
        <div class="table-responsive">
          <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td><span class="badge" :class="user.role">{{ user.role }}</span></td>
              <td>{{ new Date(user.createdAt).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>

    <!-- User Stats -->
    <div v-show="activeTab === 'stats'">
      <div class="products-table glass-panel">
        <h3>User Activity & Orders</h3>
        <div v-if="userStats.length === 0" class="empty-state">
          <p>No orders yet</p>
        </div>
        <div v-else class="table-responsive">
          <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Items Purchased</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stat in userStats" :key="stat.userId">
              <td>{{ stat.name }}</td>
              <td>{{ stat.email }}</td>
              <td>{{ stat.orderCount }}</td>
              <td>{{ stat.totalItems }}</td>
              <td>₹{{ stat.totalSpent.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.tabs button {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  color: #64748b;
  position: relative;
  transition: color 0.3s;
}

.tabs button.active {
  color: var(--primary-color);
}

.tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
}

.form-container {
  padding: 2rem;
  margin-bottom: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.5);
}

.products-table {
  padding: 1.5rem;
  overflow-x: auto;
}

.products-table h3 {
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

th {
  font-weight: 600;
  color: var(--primary-color);
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.admin {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.badge.user {
  background: rgba(74, 222, 128, 0.1);
  color: var(--primary-color);
}

.badge.pending {
  background: rgba(251, 191, 36, 0.1);
  color: #d97706;
}

.badge.completed {
  background: rgba(74, 222, 128, 0.1);
  color: #10b981;
}

.badge.cancelled {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

/* Stats Cards */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  background: rgba(34, 197, 94, 0.1);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
}

.stat-info p {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.stat-info h3 {
  margin-bottom: 0;
  font-size: 1.5rem;
  color: var(--text-dark);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs {
    overflow-x: auto;
  }
  
  table {
    font-size: 0.875rem;
  }
  
  th, td {
    padding: 0.75rem 0.5rem;
  }

  .stats-overview {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
}
</style>

<style scoped>
.status-select {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.1);
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
}

.status-select:hover {
  border-color: var(--primary-color);
}
</style>
