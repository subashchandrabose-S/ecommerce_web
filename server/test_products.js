const { db } = require('./config/db');
const Product = require('./models/Product');

async function testProducts() {
    try {
        console.log('Fetching products from Firestore...');
        const products = await Product.find();
        console.log(`Found ${products.length} products`);

        if (products.length > 0) {
            console.log('\nFirst product:');
            console.log(JSON.stringify(products[0], null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testProducts();
