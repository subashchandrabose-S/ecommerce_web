<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const products = ref([])
const users = ref([])
const userStats = ref([])
const loading = ref(true)
const showForm = ref(false)
const activeTab = ref('products') // 'products', 'users', 'stats'

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
  await fetchUserStats()
})
</script>

<template>
  <div class="admin-dashboard">
    <header class="header">
      <h1>Admin Dashboard</h1>
      <button v-if="activeTab === 'products'" @click="showForm = !showForm" class="btn btn-primary">
        {{ showForm ? 'Cancel' : 'Add New Product' }}
      </button>
    </header>

    <!-- Tabs -->
    <div class="tabs">
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
}
</style>
