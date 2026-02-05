const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Order = require('../models/Order');

// Export orders to Excel
router.get('/export/excel', async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Orders');

        worksheet.columns = [
            { header: 'Order ID', key: 'orderID', width: 15 },
            { header: 'User', key: 'userName', width: 20 },
            { header: 'Email', key: 'userEmail', width: 25 },
            { header: 'Address', key: 'shippingAddress', width: 30 },
            { header: 'Items', key: 'itemsCount', width: 10 },
            { header: 'Total Amount', key: 'totalAmount', width: 15 },
            { header: 'Status', key: 'status', width: 12 },
            { header: 'Date', key: 'createdAt', width: 20 }
        ];

        orders.forEach(order => {
            worksheet.addRow({
                orderID: order.orderID || 'N/A',
                userName: order.user ? order.user.name : 'Unknown',
                userEmail: order.user ? order.user.email : 'N/A',
                shippingAddress: order.shippingAddress || 'N/A',
                itemsCount: order.items.length,
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt.toLocaleString()
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Export orders to PDF
router.get('/export/pdf', async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email');
        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=orders.pdf');

        doc.pipe(res);

        doc.fontSize(20).text('Order Report', { align: 'center' });
        doc.moveDown();

        orders.forEach((order, index) => {
            doc.fontSize(14).text(`Order #${order.orderID || index + 1}`, { underline: true });
            doc.fontSize(10).text(`User: ${order.user ? order.user.name : 'Unknown'} (${order.user ? order.user.email : 'N/A'})`);
            doc.text(`Address: ${order.shippingAddress || 'No address provided'}`);
            doc.text(`Status: ${order.status}`);
            doc.text(`Date: ${order.createdAt.toLocaleString()}`);
            doc.text(`Total Amount: ₹${order.totalAmount}`);
            doc.text(`Items:`);

            order.items.forEach(item => {
                doc.text(`  - ${item.name} x ${item.quantity} (₹${item.price} each)`);
            });

            doc.moveDown();
            if (index < orders.length - 1) {
                doc.addPage();
            }
        });

        doc.end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update order status
router.patch('/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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
