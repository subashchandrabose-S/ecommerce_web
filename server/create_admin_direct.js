const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function run() {
    try {
        const rawKey = process.env.FIREBASE_PRIVATE_KEY;
        if (!rawKey) throw new Error('No FIREBASE_PRIVATE_KEY in .env');

        // Handle both valid newlines and escaped newlines
        const key = rawKey.includes('\n') ? rawKey : rawKey.replace(/\\n/g, '\n');

        admin.initializeApp({
            credential: admin.credential.cert({
                project_id: process.env.FIREBASE_PROJECT_ID,
                private_key: key,
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
            })
        });

        const db = admin.firestore();
        console.log('Connected to Firestore. Creating/Updating Admin...');

        const email = 'admin@nursery.com';
        const newPassword = 'NurseryAdmin@2025!';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).limit(1).get();

        if (snapshot.empty) {
            await usersRef.add({
                name: 'Admin User',
                email: email,
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date().toISOString()
            });
            console.log('✅ Admin User Created Successfully!');
        } else {
            const userDoc = snapshot.docs[0];
            await userDoc.ref.update({
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Admin User Updated Successfully!');
        }

        console.log('');
        console.log('Login with:');
        console.log('Email:', email);
        console.log('Password:', newPassword);

        process.exit(0);
    } catch (e) {
        console.error('❌ Error:', e.message);
        process.exit(1);
    }
}
run();
