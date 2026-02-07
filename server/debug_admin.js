const { db } = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function checkAdmin() {
    try {
        console.log('Searching for admin user...');
        const admin = await User.findOne({ email: 'admin@nursery.com' });

        if (admin) {
            console.log('✅ Admin user found:');
            console.log('Name:', admin.name);
            console.log('Email:', admin.email);
            console.log('Role:', admin.role);

            const testPass = 'NurseryAdmin@2025!';
            const isMatch = await bcrypt.compare(testPass, admin.password);
            console.log('Password Match Test:', isMatch ? '✅ MATCH' : '❌ FAIL');
        } else {
            console.log('❌ Admin user NOT found in database.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkAdmin();
