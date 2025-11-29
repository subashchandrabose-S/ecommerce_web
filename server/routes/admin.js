const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user orders count
router.get('/user-stats', async (req, res) => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$user',
                    orderCount: { $sum: 1 },
                    totalSpent: { $sum: '$totalAmount' },
                    totalItems: { $sum: { $size: '$items' } }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {
                $unwind: '$userInfo'
            },
            {
                $project: {
                    userId: '$_id',
                    name: '$userInfo.name',
                    email: '$userInfo.email',
                    orderCount: 1,
                    totalSpent: 1,
                    totalItems: 1
                }
            }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
