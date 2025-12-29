const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection (reference-style)
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'nursery_ecommerce';

const connectDB = async () => {
    if (!MONGODB_URI) {
        console.error('MongoDB connection error: MONGODB_URI is not defined in environment variables.');
        console.error('Create server/.env with: MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/nursery_ecommerce');
        process.exit(1);
    }

    try {
        const maskedURI = MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://$1:***@');
        console.log('Attempting to connect to MongoDB Atlas...');
        console.log('URI (masked):', maskedURI);

        const conn = await mongoose.connect(MONGODB_URI, {
            dbName: DB_NAME,
            serverSelectionTimeoutMS: 15000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log('Database:', conn.connection.db.databaseName);
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        if (error.reason && error.reason.message) {
            console.error('Server selection reason:', error.reason.message);
        }
        process.exit(1);
    }
};

// Connect to DB once at startup
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Simple health route (similar to reference)
app.get('/api/health', (req, res) => {
    res.json({
        message: 'API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const ordersRoutes = require('./routes/orders');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', ordersRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Nursery E-commerce API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            products: '/api/products',
            admin: '/api/admin',
            orders: '/api/orders',
        },
    });
});

// Export for Vercel
module.exports = app;

// Only listen if run directly (local dev)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
}
