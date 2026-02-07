const path = require('path');
const dotenvResult = require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
console.log('Dotenv Result:', {
    error: dotenvResult.error ? dotenvResult.error.message : null,
    parsed: dotenvResult.parsed ? Object.keys(dotenvResult.parsed) : null
});
console.log('Checks:', {
    project_id: !!process.env.FIREBASE_PROJECT_ID,
    email: !!process.env.FIREBASE_CLIENT_EMAIL
});
const admin = require('firebase-admin');

// Initialize immediately using environment variables
const initializeFirebase = () => {
    try {
        if (!admin.apps.length) {
            const requiredVars = [
                'FIREBASE_PROJECT_ID',
                'FIREBASE_PRIVATE_KEY_ID',
                'FIREBASE_PRIVATE_KEY',
                'FIREBASE_CLIENT_EMAIL',
                'FIREBASE_CLIENT_ID'
            ];

            const missing = requiredVars.filter(v => !process.env[v]);
            if (missing.length > 0) {
                console.error('Firebase Initialization Error: Missing environment variables:', missing.join(', '));
                return null;
            }

            console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
            console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);

            const rawKey = process.env.FIREBASE_PRIVATE_KEY;
            const privateKey = rawKey.includes('\n') ? rawKey : rawKey.replace(/\\n/g, '\n');

            const serviceAccount = {
                type: "service_account",
                project_id: process.env.FIREBASE_PROJECT_ID,
                private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                private_key: privateKey,
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
                client_id: process.env.FIREBASE_CLIENT_ID,
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL.replace('@', '%40')}`,
                universe_domain: "googleapis.com"
            };

            const app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('Firebase Admin Initialized Successfully');
            return app;
        }
        return admin.app();
    } catch (error) {
        console.error('Firebase Initialization Error:', error.message);
        console.error(error.stack);
        return null;
    }
};

const app = initializeFirebase();
const db = app ? admin.firestore() : null;

const connectDB = () => {
    if (db) {
        console.log('Firestore connected');
    } else {
        console.error('Firestore NOT connected - Database is unavailable');
    }
};

module.exports = { connectDB, db, admin };
