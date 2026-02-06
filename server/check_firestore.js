const { db } = require('./config/db');

async function checkFirestore() {
    try {
        const snapshot = await db.collection('products').get();
        console.log(`Total products in Firestore: ${snapshot.size}`);

        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`\n${data.name}:`);
            console.log(`  - Category: ${data.category}`);
            console.log(`  - SubCategory: ${data.subCategory}`);
            console.log(`  - Price: ₹${data.price}`);
            console.log(`  - Image: ${data.image ? 'Yes' : 'No'}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkFirestore();
