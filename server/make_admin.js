const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

async function run() {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        const db = admin.firestore();
        const users = await db.collection('users').get();
        if (users.empty) {
            console.log('No users found in database.');
        } else {
            const firstUser = users.docs[0];
            await firstUser.ref.update({ role: 'admin' });
            console.log(`✅ User ${firstUser.data().email} is now an ADMIN!`);
        }
        process.exit(0);
    } catch (e) {
        console.error('FAILED:', e.message);
        process.exit(1);
    }
}
run();
