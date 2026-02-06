const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize immediately
try {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin Initialized');
    }
} catch (error) {
    console.error('Firebase Connection Error:', error.message);
    process.exit(1);
}

const db = admin.firestore();

const connectDB = () => {
    console.log('Firestore connected');
};

module.exports = { connectDB, db, admin };
