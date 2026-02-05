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
        const newPassword = 'NurseryAdmin@2025!';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Check if admin already exists
        let admin = await User.findOne({ email: 'admin@nursery.com' });

        if (admin) {
            console.log('Admin user found. Updating password...');
            admin.password = hashedPassword;
            admin.role = 'admin'; // Ensure role is admin
            await admin.save();
            console.log('✅ Admin password updated successfully!');
        } else {
            console.log('Creating new admin user...');
            admin = new User({
                name: 'Admin User',
                email: 'admin@nursery.com',
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('✅ Admin user created successfully!');
        }

        console.log('');
        console.log('=================================');
        console.log('Admin Login Credentials:');
        console.log('=================================');
        console.log('Email: admin@nursery.com');
        console.log('Password: ' + newPassword);
        console.log('=================================');
        console.log('');
        console.log('You can now login at: http://localhost:5173/login');

        mongoose.connection.close();
    } catch (err) {
        console.error('Error creating/updating admin:', err);
        mongoose.connection.close();
    }
};

createAdmin();
