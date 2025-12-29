const mongoose = require('mongoose');
const Order = require('./models/Order');
const dotenv = require('dotenv');

dotenv.config();

const fs = require('fs');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'nursery_ecommerce';

if (!MONGODB_URI) {
    console.error('MONGODB_URI not set. Please add it to server/.env before running verifyOrder.js');
    process.exit(1);
}

mongoose.connect(MONGODB_URI, { dbName: DB_NAME })
    .then(async () => {
        console.log('Connected to DB');
        try {
            const order = new Order({
                user: new mongoose.Types.ObjectId(), // Dummy user ID
                items: [{
                    name: 'Test Product',
                    quantity: 1,
                    price: 100
                }],
                totalAmount: 100,
                status: 'pending'
            });

            await order.save();
            fs.writeFileSync('success.txt', `Order created with ID: ${order.orderId}`);

            // Clean up
            await Order.findByIdAndDelete(order._id);
            console.log('Test order deleted');
        } catch (err) {
            fs.writeFileSync('error.txt', err.stack || err.toString());
            console.error('Error:', err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => {
        fs.writeFileSync('error.txt', err.stack || err.toString());
        console.error(err);
    });
