const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL?.replace('@', '%40')}`,
    universe_domain: "googleapis.com"
};

async function run() {
    try {
        console.log('Initializing Firebase...');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        const db = admin.firestore();

        console.log('Searching for admin...');
        const email = 'admin@nursery.com';
        const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();

        const newPassword = 'NurseryAdmin@2025!';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        if (snapshot.empty) {
            console.log('Creating new admin...');
            await db.collection('users').add({
                name: 'Admin User',
                email: email,
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date()
            });
            console.log('✅ Created!');
        } else {
            console.log('Updating admin...');
            await snapshot.docs[0].ref.update({
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Updated!');
        }
        process.exit(0);
    } catch (e) {
        console.error('FAILED:', e.message);
        process.exit(1);
    }
}
run();
