const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
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
                console.error('Firebase Error: Missing environment variables:', missing.join(', '));
                return null;
            }

            console.log('Initializing Firebase for project:', process.env.FIREBASE_PROJECT_ID);
            const rawKey = process.env.FIREBASE_PRIVATE_KEY;
            const privateKey = rawKey.includes('\n') ? rawKey : rawKey.replace(/\\n/g, '\n');

            const serviceAccount = {
                project_id: process.env.FIREBASE_PROJECT_ID,
                private_key: privateKey,
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
            };

            return admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
        return admin.app();
    } catch (error) {
        console.error('Firebase Initialization Error:', error.message);
        return null;
    }
};

const app = initializeFirebase();
const db = app ? admin.firestore() : null;

const connectDB = () => {
    if (db) {
        console.log('Firebase (Firestore) connected successfully');
    } else {
        console.error('Firebase (Firestore) NOT connected');
    }
};

module.exports = { connectDB, db, admin };
