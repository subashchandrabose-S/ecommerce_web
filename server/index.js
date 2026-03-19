const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Allowed origins
const allowedOrigins = [
    'https://mithranursery.vercel.app',
    'https://mithra-nursery.vercel.app',
    'http://localhost:5173',
    process.env.CLIENT_URL
].map(url => url?.replace(/\/$/, '')).filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        // Check if origin is in our allowed list
        const normalizedOrigin = origin.replace(/\/$/, '');
        console.log('Origin check:', { origin, normalizedOrigin, allowed: allowedOrigins.includes(normalizedOrigin) });

        if (allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            console.error('CORS BLOCK:', origin, 'Allowed:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Mithra Nursery API is running...',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development',
        config: {
            mongo_uri: process.env.MONGO_URI ? 'PRESENT' : 'MISSING',
            jwt_secret: process.env.JWT_SECRET ? 'PRESENT' : 'MISSING',
            client_url: process.env.CLIENT_URL ? 'PRESENT' : 'MISSING'
        }
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on the server'
    });
});

// Export for Vercel
module.exports = app;

// Only listen if run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
