const mongoose = require('mongoose');
const Order = require('./models/Order');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

// Simple mock update test
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nursery_ecommerce')
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
