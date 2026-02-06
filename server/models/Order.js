const { db } = require('../config/db');
const Counter = require('./Counter');

class Order {
    constructor(data) {
        this.id = data.id || null;
        this.orderID = data.orderID;
        this.user = data.user; // Can be string ID or object if populated
        this.items = data.items || [];
        this.totalAmount = data.totalAmount;
        this.shippingAddress = data.shippingAddress || 'No address provided';
        this.status = data.status || 'pending';
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    }

    static async find() {
        // Returns basic query snapshot helper or list
        // Since admin.js uses .populate(), we can't just return array yet if we strictly follow the code there without changing it.
        // But we ARE changing admin.js. So let's return array here.
        const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => new Order({ id: doc.id, ...doc.data() }));
    }

    static async findById(id) {
        const doc = await db.collection('orders').doc(id).get();
        if (!doc.exists) return null;
        return new Order({ id: doc.id, ...doc.data() });
    }

    static async findByIdAndUpdate(id, update, options) {
        await db.collection('orders').doc(id).update(update);
        return Order.findById(id);
    }

    async save() {
        // Auto-increment orderID if new
        if (!this.id && !this.orderID) {
            const counter = await Counter.findOneAndUpdate(
                { id: 'orderID' },
                { $inc: { seq: 1 } }
            );
            this.orderID = counter.seq;
        }

        const orderData = {
            orderID: this.orderID,
            user: this.user, // Save User ID
            items: this.items.map(item => ({
                ...item,
                // Ensure product ID is string
                product: item.product.toString(),
                description: item.description || '' // Handle potential undefined
            })),
            totalAmount: this.totalAmount,
            shippingAddress: this.shippingAddress,
            status: this.status,
            createdAt: this.createdAt
        };

        // Remove undefined fields
        Object.keys(orderData).forEach(key => orderData[key] === undefined && delete orderData[key]);

        if (this.id) {
            await db.collection('orders').doc(this.id).set(orderData, { merge: true });
        } else {
            const res = await db.collection('orders').add(orderData);
            this.id = res.id;
        }
        return this;
    }
}

module.exports = Order;
