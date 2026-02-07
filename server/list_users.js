require('dotenv').config();
const { db } = require('./config/db');

async function check() {
    try {
        console.log('Fetching all users...');
        const snapshot = await db.collection('users').get();
        if (snapshot.empty) {
            console.log('No users found.');
        } else {
            snapshot.forEach(doc => {
                const data = doc.data();
                console.log(`- ID: ${doc.id}, Email: ${data.email}, Role: ${data.role}`);
            });
        }
        process.exit(0);
    } catch (e) {
        console.error('Error:', e.message);
        process.exit(1);
    }
}
check();
