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
    shippingAddress: {
        type: String,
        default: 'No address provided'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { id: 'orderID' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.orderID = counter.seq;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model('Order', orderSchema);
