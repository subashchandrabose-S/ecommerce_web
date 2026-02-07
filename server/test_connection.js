const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const admin = require('firebase-admin');

const rawKey = process.env.FIREBASE_PRIVATE_KEY;
console.log('Raw Key Length:', rawKey ? rawKey.length : 0);

// Detect if it has real newlines or literal \n
const key = rawKey.includes('\n') ? rawKey : rawKey.replace(/\\n/g, '\n');

try {
    admin.initializeApp({
        credential: admin.credential.cert({
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key: key,
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
        })
    });
    console.log('✅ Connected to Firebase!');
    process.exit(0);
} catch (e) {
    console.error('❌ Failed:', e.message);
    process.exit(1);
}
