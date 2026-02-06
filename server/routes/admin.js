const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Order = require('../models/Order');

// Helper to manual populate users
async function getOrdersWithUsers() {
    const orders = await Order.find();
    // Get all unique user IDs
    const userIds = [...new Set(orders.map(o => o.user))].filter(Boolean);

    // Fetch users (In Firestore, getAll by IDs isn't one call comfortably for many, 
    // but usually we can do Promise.all or fetch all users if not too many)
    // For scalability, whereIn limited to 10. Better to just fetch all users for admin dashboard or fetch individually.
    // Given the context (Nursery), user base might be small initially. Fetching all users is safe.
    const users = await User.find();
    const userMap = {};
    users.forEach(u => userMap[u.id] = u);

    return orders.map(order => {
        // Create a plain object copy to attach user
        const orderObj = { ...order };
        orderObj.user = userMap[order.user] || { name: 'Unknown', email: 'N/A' };
        return orderObj;
    });
}

// Export orders to Excel
router.get('/export/excel', async (req, res) => {
    try {
        const orders = await getOrdersWithUsers();
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
                userName: order.user.name,
                userEmail: order.user.email,
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
        const orders = await getOrdersWithUsers();
        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=orders.pdf');

        doc.pipe(res);

        doc.fontSize(20).text('Order Report', { align: 'center' });
        doc.moveDown();

        orders.forEach((order, index) => {
            doc.fontSize(14).text(`Order #${order.orderID || index + 1}`, { underline: true });
            doc.fontSize(10).text(`User: ${order.user.name} (${order.user.email})`);
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
        const users = await User.find();
        // Remove password
        const safeUsers = users.map(u => {
            const { password, ...rest } = u;
            return rest;
        });
        res.json(safeUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await getOrdersWithUsers();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user orders count
router.get('/user-stats', async (req, res) => {
    try {
        const orders = await Order.find();
        const users = await User.find();
        const userMap = {};
        users.forEach(u => userMap[u.id] = u);

        // Perform aggregation in memory
        const statsMap = {};

        orders.forEach(order => {
            const userId = order.user;
            if (!statsMap[userId]) {
                const user = userMap[userId] || {};
                statsMap[userId] = {
                    userId: userId,
                    name: user.name || 'Unknown',
                    email: user.email || 'N/A',
                    orderCount: 0,
                    totalSpent: 0,
                    totalItems: 0
                };
            }

            statsMap[userId].orderCount += 1;
            statsMap[userId].totalSpent += (order.totalAmount || 0);
            statsMap[userId].totalItems += (order.items ? order.items.length : 0);
        });

        const stats = Object.values(statsMap);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
