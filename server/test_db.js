const { db, admin } = require('./config/db');

async function test() {
    try {
        console.log('Testing Firestore connection...');
        const collections = await db.listCollections();
        console.log('Collections:', collections.map(c => c.id));
        console.log('Connection successful!');
    } catch (error) {
        console.error('CONNECTION FAILED');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        // console.error('Full Error:', error); 
    }
}

test();
