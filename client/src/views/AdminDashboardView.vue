<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const products = ref([])
const users = ref([])
const userStats = ref([])
const orders = ref([])
const loading = ref(true)
const showForm = ref(false)
const activeTab = ref('products') // 'products', 'users', 'stats', 'orders'
const selectedOrder = ref(null)
const showOrderModal = ref(false)

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
    const res = await axios.get(`${API_BASE_URL}/admin/users`)
    users.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const fetchOrders = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/admin/orders`)
    orders.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const fetchUserStats = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/admin/user-stats`)
    userStats.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const updateOrderStatus = async (status) => {
  if (!selectedOrder.value) return
  try {
    await axios.patch(`${API_BASE_URL}/admin/orders/${selectedOrder.value._id}/status`, { status })
    await fetchOrders()
    selectedOrder.value.status = status
    alert('Order status updated successfully')
  } catch (err) {
    console.error(err)
    alert('Failed to update order status')
  }
}

const handleExport = (type) => {
  window.open(`${API_BASE_URL}/admin/export/${type}`, '_blank');
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

const handleSubmit = async () => {
  try {
    await axios.post(`${API_BASE_URL}/products`, form.value)
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
    await axios.delete(`${API_BASE_URL}/products/${id}`)
    await fetchProducts()
  } catch (err) {
    console.error(err)
    alert('Failed to delete product')
  }
}

onMounted(async () => {
  await fetchProducts()
  await fetchUsers()
  await fetchOrders()
  await fetchUserStats()
})
</script>

<template>
  <div class="admin-dashboard">
    <header class="header">
      <h1>Admin Dashboard</h1>
      <div class="header-actions">
        <div v-if="activeTab === 'orders'" class="export-actions">
          <button @click="handleExport('excel')" class="btn btn-secondary">Export Excel</button>
          <button @click="handleExport('pdf')" class="btn btn-secondary">Export PDF</button>
        </div>
        <button v-if="activeTab === 'products'" @click="showForm = !showForm" class="btn btn-primary">
          {{ showForm ? 'Cancel' : 'Add New Product' }}
        </button>
      </div>
    </header>

    <!-- Tabs -->
    <div class="tabs">
      <button @click="activeTab = 'products'" :class="{ active: activeTab === 'products' }">
        Products ({{ products.length }})
      </button>
      <button @click="activeTab = 'users'" :class="{ active: activeTab === 'users' }">
        Users ({{ users.length }})
      </button>
      <button @click="activeTab = 'orders'" :class="{ active: activeTab === 'orders' }">
        Orders ({{ orders.length }})
      </button>
      <button @click="activeTab = 'stats'" :class="{ active: activeTab === 'stats' }">
        User Activity
      </button>
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
              <label>Image URL</label>
              <input v-model="form.image" required placeholder="https://..." />
            </div>
            <div class="form-group full-width">
              <label>Description</label>
              <textarea v-model="form.description" required></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Save Product</button>
        </form>
      </div>

      <div class="products-table glass-panel">
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

    <!-- User Management -->
    <div v-show="activeTab === 'users'">
      <div class="products-table glass-panel">
        <h3>Registered Users</h3>
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

    <!-- Orders Management -->
    <div v-show="activeTab === 'orders'">
      <div class="products-table glass-panel">
        <h3>Order Transactions</h3>
        <div v-if="orders.length === 0" class="empty-state">
          <p>No orders recorded yet</p>
        </div>
        <table v-else>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order._id">
              <td>#{{ order.orderID || 'N/A' }}</td>
              <td>{{ order.user ? order.user.name : 'Unknown' }}</td>
              <td>{{ order.items.length }}</td>
              <td>₹{{ order.totalAmount.toFixed(2) }}</td>
              <td><span class="badge" :class="order.status">{{ order.status }}</span></td>
              <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
              <td>
                <button @click="viewOrderDetails(order)" class="btn btn-sm btn-primary">Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- User Stats -->
    <div v-show="activeTab === 'stats'">
      <div class="products-table glass-panel">
        <h3>User Activity & Orders</h3>
        <div v-if="userStats.length === 0" class="empty-state">
          <p>No orders yet</p>
        </div>
        <table v-else>
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

    <!-- Order Detail Modal -->
    <div v-if="showOrderModal" class="modal-overlay" @click.self="showOrderModal = false">
      <div class="modal-content glass-panel">
        <header class="modal-header">
          <h3>Order Details - #{{ selectedOrder.orderID || 'N/A' }}</h3>
          <button @click="showOrderModal = false" class="close-btn">&times;</button>
        </header>
        <div v-if="selectedOrder" class="order-info">
          <div class="info-grid">
            <div class="info-item">
              <label>System ID:</label>
              <span>{{ selectedOrder._id }}</span>
            </div>
            <div class="info-item">
              <label>Customer:</label>
              <span>{{ selectedOrder.user ? selectedOrder.user.name : 'Unknown' }} ({{ selectedOrder.user ? selectedOrder.user.email : 'N/A' }})</span>
            </div>
            <div class="info-item">
              <label>Date:</label>
              <span>{{ new Date(selectedOrder.createdAt).toLocaleString() }}</span>
            </div>
            <div class="info-item">
              <label>Address:</label>
              <span>{{ selectedOrder.shippingAddress || 'No address provided' }}</span>
            </div>
            <div class="info-item">
              <label>Current Status:</label>
              <span class="badge" :class="selectedOrder.status">{{ selectedOrder.status }}</span>
            </div>
            <div class="info-item">
              <label>Update Status:</label>
              <select :value="selectedOrder.status" @change="updateOrderStatus($event.target.value)" class="status-select">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <h4>Items</h4>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in selectedOrder.items" :key="item._id">
                <td>{{ item.name }}</td>
                <td>₹{{ item.price }}</td>
                <td>{{ item.quantity }}</td>
                <td>₹{{ (item.price * item.quantity).toFixed(2) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="total-label">Total Amount</td>
                <td class="total-value">₹{{ selectedOrder.totalAmount.toFixed(2) }}</td>
              </tr>
            </tfoot>
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

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.export-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-secondary {
  background: var(--secondary-color, #64748b);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  background: white;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-item label {
  display: block;
  font-weight: 600;
  color: #64748b;
  font-size: 0.875rem;
}

.items-table {
  width: 100%;
  margin-top: 1rem;
}

.total-label {
  text-align: right;
  font-weight: 700;
}

.total-value {
  font-weight: 700;
  color: var(--primary-color);
}

.status-select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.1);
  background: white;
  margin-top: 0.25rem;
}

.badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.badge.completed { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.badge.cancelled { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

@media (max-width: 768px) {
  .form-grid, .info-grid {
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
}
</style>
