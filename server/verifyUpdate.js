const mongoose = require('mongoose');
const Order = require('./models/Order');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'nursery_ecommerce';

if (!MONGODB_URI) {
    console.error('MONGODB_URI not set. Please add it to server/.env before running verifyUpdate.js');
    process.exit(1);
}

// Simple mock update test
mongoose.connect(MONGODB_URI, { dbName: DB_NAME })
    .then(async () => {
        console.log('Connected to DB');
        try {
            // 1. Create dummy order
            const order = new Order({
                user: new mongoose.Types.ObjectId(),
                items: [{ name: 'Test', quantity: 1, price: 50 }],
                totalAmount: 50,
                status: 'pending'
            });
            await order.save();
            console.log('Created order:', order._id, order.status);



            const updated = await Order.findByIdAndUpdate(
                order._id,
                { status: 'completed' },
                { new: true }
            );
            console.log('Updated order:', updated._id, updated.status);

            if (updated.status === 'completed') {
                require('fs').writeFileSync('success_update.txt', 'Order update verified');
            }

            await Order.findByIdAndDelete(order._id);
        } catch (err) {
            console.error(err);
            require('fs').writeFileSync('error_update.txt', err.toString());
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => console.error(err));
