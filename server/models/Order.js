const mongoose = require('mongoose');
const Counter = require('./Counter');

const orderSchema = new mongoose.Schema({
    orderID: {
        type: Number,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: String, // Denormalized name for receipts
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    fullName: String,
    phoneNumber: String,
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-increment orderID
orderSchema.pre('save', async function (next) {
    if (!this.orderID) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { id: 'orderID' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.orderID = counter.seq;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
