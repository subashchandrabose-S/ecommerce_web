<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const order = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/orders/${route.params.id}`, {
            headers: { 'x-auth-token': auth.token }
        })
        order.value = res.data
    } catch (err) {
        error.value = 'Failed to load order details.'
        console.error(err)
    } finally {
        loading.value = false
    }
})

const handlePayment = async () => {
    if (!confirm('Confirm you have made the payment?')) return

    try {
        await axios.put(`${API_BASE_URL}/orders/${route.params.id}/pay`, {}, {
            headers: { 'x-auth-token': auth.token }
        })
        alert('Payment confirmed! Thank you for your order.')
        router.push('/')
    } catch (err) {
        console.error(err)
        alert('Failed to confirm payment. Please try again.')
    }
}
</script>

<template>
    <div class="payment-view container animate-fade">
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else class="payment-card glass-panel">
            <header>
                <h1>Complete Your Payment</h1>
                <p class="order-id">Order ID: {{ order.orderId || order._id.toUpperCase() }}</p>
            </header>
            
            <div class="amount-section">
                <span>Total Amount to Pay</span>
                <span class="amount">₹{{ order.totalAmount }}</span>
                <div class="shipping-info">
                    <p><strong>Shipping to:</strong> {{ order.fullName }}</p>
                    <p>{{ order.phoneNumber }}</p>
                    <p class="address">{{ order.shippingAddress }}</p>
                </div>
            </div>

            <div class="qr-section">
                <p>Scan QR Code to Pay</p>
                <!-- Placeholder QR Code using API or static image -->
                <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=shop&pn=NurseryShop&am=${order.totalAmount}&tn=Order-${order.orderId}`" alt="Payment QR Code" class="qr-code" />
                <p class="upi-id">UPI ID: shop@upi</p>
            </div>

            <div class="terms-section">
                <h3>Terms and Conditions</h3>
                <ul>
                    <li>Payment must be made within 15 minutes.</li>
                    <li>Orders will be processed after payment confirmation.</li>
                    <li>No refunds for perishable items.</li>
                </ul>
            </div>

            <button @click="handlePayment" class="btn btn-primary full-width">
                I have made the payment
            </button>
        </div>
    </div>
</template>

<style scoped>
.payment-view {
    max-width: 500px;
    margin: 2rem auto;
}

.payment-card {
    padding: 2rem;
    text-align: center;
}

.order-id {
    color: #64748b;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

.amount-section {
    margin: 2rem 0;
    padding: 1.5rem;
    background: rgba(74, 222, 128, 0.1);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.amount {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--primary-color);
}

.shipping-info {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(0,0,0,0.1);
    font-size: 0.95rem;
    color: #4b5563;
}

.shipping-info p {
    margin: 0.25rem 0;
}

.address {
    font-style: italic;
}

.qr-section {
    margin-bottom: 2rem;
}

.qr-code {
    margin: 1rem 0;
    border-radius: 8px;
    border: 1px solid rgba(0,0,0,0.1);
}

.upi-id {
    font-family: monospace;
    font-size: 1.1rem;
    background: white;
    padding: 0.5rem;
    border-radius: 6px;
    display: inline-block;
}

.terms-section {
    text-align: left;
    margin-bottom: 2rem;
    font-size: 0.85rem;
    color: #64748b;
}

.terms-section h3 {
    margin-bottom: 0.5rem;
    color: var(--text-color);
}

.terms-section ul {
    padding-left: 1.2rem;
}

.full-width {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
}

@media (max-width: 480px) {
    .payment-card {
        padding: 1.5rem 1rem;
    }
    
    .amount {
        font-size: 2rem;
    }
    
    .order-id {
        font-size: 0.8rem;
    }
}
</style>
