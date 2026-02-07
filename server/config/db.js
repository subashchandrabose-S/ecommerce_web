const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const admin = require('firebase-admin');

// Initialize immediately using environment variables
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
            console.log('Environment Debug:', {
                NODE_ENV: process.env.NODE_ENV,
                loadedKeys: Object.keys(process.env).filter(k => k.startsWith('FIREBASE_'))
            });
            throw new Error(`Missing Firebase environment variables: ${missing.join(', ')}`);
        }

        const privateKey = process.env.FIREBASE_PRIVATE_KEY
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            : undefined;

        // Create service account object from environment variables
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

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin Initialized');
    }
} catch (error) {
    console.error('Firebase Initialization Error:', error.message);
    // Log helpful info but don't crash the whole app if imported elsewhere
}

const db = admin.firestore();

const connectDB = () => {
    console.log('Firestore connected');
};

module.exports = { connectDB, db, admin };
