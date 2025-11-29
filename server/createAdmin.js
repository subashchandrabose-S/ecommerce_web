const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nursery_ecommerce')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const createAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@nursery.com' });

        if (existingAdmin) {
            console.log('Admin user already exists!');
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
