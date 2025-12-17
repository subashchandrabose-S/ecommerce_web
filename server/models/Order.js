const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    orderId: {
        type: String,
        unique: true,
        sparse: true
    }
}, { timestamps: true });

orderSchema.pre('save', async function () {
    if (!this.orderId) {
        // Generate a random 5-digit number
        const random = Math.floor(10000 + Math.random() * 90000).toString();
        this.orderId = random;
    }
});

module.exports = mongoose.model('Order', orderSchema);
