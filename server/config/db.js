const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is missing in environment variables');
            return;
        }
        
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        if (error.name === 'MongoParseError') {
            console.error('Invalid MONGO_URI format. Please check your connection string.');
        }
        // Don't exit process in Vercel/Production as it might cause infinite restarts
        if (process.env.NODE_ENV === 'development') {
            process.exit(1);
        }
    }
};

module.exports = { connectDB };
