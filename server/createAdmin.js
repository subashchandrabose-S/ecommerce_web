const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'nursery_ecommerce';

if (!MONGODB_URI) {
    console.error('MONGODB_URI not set. Please add it to server/.env before running createAdmin.js');
    process.exit(1);
}

mongoose
    .connect(MONGODB_URI, { dbName: DB_NAME })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => {
        console.error('MongoDB connection error in createAdmin:', err.message);
        process.exit(1);
    });

const createAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@nursery.com' });

        if (existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            existingAdmin.password = hashedPassword;
            existingAdmin.role = 'admin';
            if (!existingAdmin.mobile) existingAdmin.mobile = '0000000000';
            await existingAdmin.save();
            console.log('✅ Admin credentials reset successfully!');
            console.log('Email: admin@nursery.com');
            console.log('Password: admin123');
            mongoose.connection.close();
            return;
        }

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = new User({
            name: 'Admin User',
            email: 'admin@nursery.com',
            mobile: '0000000000',
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('✅ Admin user created successfully!');
        console.log('');
        console.log('=================================');
        console.log('Admin Login Credentials:');
        console.log('=================================');
        console.log('Email: admin@nursery.com');
        console.log('Password: admin123');
        console.log('=================================');
        console.log('');
        console.log('You can now login at: http://localhost:5173/admin-login');

        mongoose.connection.close();
    } catch (err) {
        console.error('Error creating admin:', err);
        mongoose.connection.close();
    }
};

createAdmin();
