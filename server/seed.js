const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nursery_ecommerce')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const products = [
    // Indoor Plants
    {
        name: 'Monstera Deliciosa',
        description: 'The Swiss Cheese Plant. Iconic split leaves, perfect for indoor tropical vibes.',
        price: 2999,
        category: 'Nursery',
        subCategory: 'Indoor',
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
        stock: 50,
        featured: true
    },
    {
        name: 'Snake Plant',
        description: 'Indestructible and air-purifying. Great for beginners and low light.',
        price: 1699,
        category: 'Nursery',
        subCategory: 'Indoor',
        image: 'https://images.unsplash.com/photo-1599598425947-d3597423db17?auto=format&fit=crop&w=600&q=80',
        stock: 100,
        featured: false
    },
    {
        name: 'Peace Lily',
        description: 'Elegant white blooms and lush green leaves. Thrives in low light indoors.',
        price: 2199,
        category: 'Nursery',
        subCategory: 'Indoor',
        image: 'https://images.unsplash.com/photo-1593691509543-c55ce32e01b5?auto=format&fit=crop&w=600&q=80',
        stock: 40,
        featured: false
    },
    {
        name: 'Pothos (Devil\'s Ivy)',
        description: 'Fast-growing vine with variegated leaves. Perfect for hanging baskets indoors.',
        price: 1499,
        category: 'Nursery',
        subCategory: 'Indoor',
        image: 'https://images.unsplash.com/photo-1598880940080-ff9a29891b85?auto=format&fit=crop&w=600&q=80',
        stock: 80,
        featured: false
    },
    {
        name: 'ZZ Plant',
        description: 'Waxy, emerald green leaves. Tolerates neglect and low light perfectly.',
        price: 2399,
        category: 'Nursery',
        subCategory: 'Indoor',
        image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=600&q=80',
        stock: 45,
        featured: false
    },

    // Outdoor Plants
    {
        name: 'Lavender',
        description: 'Fragrant purple blooms. Perfect for gardens and attracts butterflies.',
        price: 1899,
        category: 'Nursery',
        subCategory: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1611251184997-f5e0e5d3a6ac?auto=format&fit=crop&w=600&q=80',
        stock: 60,
        featured: true
    },
    {
        name: 'Rosemary',
        description: 'Aromatic herb with needle-like leaves. Great for cooking and gardens.',
        price: 1299,
        category: 'Nursery',
        subCategory: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1546195643-70c0b53c2326?auto=format&fit=crop&w=600&q=80',
        stock: 70,
        featured: false
    },
    {
        name: 'Marigold',
        description: 'Bright orange and yellow flowers. Natural pest repellent for outdoor gardens.',
        price: 999,
        category: 'Nursery',
        subCategory: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=600&q=80',
        stock: 90,
        featured: false
    },
    {
        name: 'Hibiscus',
        description: 'Large, showy flowers in vibrant colors. Perfect for outdoor landscaping.',
        price: 2599,
        category: 'Nursery',
        subCategory: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=600&q=80',
        stock: 35,
        featured: true
    },
    {
        name: 'Bougainvillea',
        description: 'Stunning colorful bracts. Hardy outdoor climber for warm climates.',
        price: 2399,
        category: 'Nursery',
        subCategory: 'Outdoor',
        image: 'https://images.unsplash.com/photo-1595423439814-24de6c3dc39e?auto=format&fit=crop&w=600&q=80',
        stock: 40,
        featured: false
    },

    // Medicine Plants
    {
        name: 'Aloe Vera',
        description: 'Medicinal succulent. Soothes burns and skin irritations naturally.',
        price: 1299,
        category: 'Nursery',
        subCategory: 'Medicine',
        image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80',
        stock: 60,
        featured: true
    },
    {
        name: 'Tulsi (Holy Basil)',
        description: 'Sacred medicinal herb. Boosts immunity and reduces stress.',
        price: 1499,
        category: 'Nursery',
        subCategory: 'Medicine',
        image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80',
        stock: 55,
        featured: false
    },
    {
        name: 'Mint',
        description: 'Refreshing medicinal herb. Aids digestion and soothes headaches.',
        price: 849,
        category: 'Nursery',
        subCategory: 'Medicine',
        image: 'https://images.unsplash.com/photo-1628556270448-9682a5ca2e1e?auto=format&fit=crop&w=600&q=80',
        stock: 75,
        featured: false
    },
    {
        name: 'Neem Tree',
        description: 'Powerful medicinal tree. Natural antibacterial and antifungal properties.',
        price: 2999,
        category: 'Nursery',
        subCategory: 'Medicine',
        image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=600&q=80',
        stock: 25,
        featured: false
    },

    // Chemical Products
    {
        name: 'All-Purpose Fertilizer',
        description: 'Balanced 10-10-10 formula for healthy growth in all plants.',
        price: 999,
        category: 'Chemical',
        image: 'https://images.unsplash.com/photo-1628676726581-2c1b87f2c6e6?auto=format&fit=crop&w=600&q=80',
        stock: 200,
        featured: false
    },
    {
        name: 'Neem Oil Spray',
        description: 'Organic pesticide and fungicide. Keeps pests away naturally.',
        price: 1299,
        category: 'Chemical',
        image: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=600&q=80',
        stock: 150,
        featured: true
    },
    {
        name: 'Rooting Hormone',
        description: 'Stimulates root growth for cuttings. Propagate your plants faster.',
        price: 849,
        category: 'Chemical',
        image: 'https://plus.unsplash.com/premium_photo-1679516785093-660168393850?auto=format&fit=crop&w=600&q=80',
        stock: 100,
        featured: false
    }
];

const seedDB = async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('✅ Database Seeded with categorized plants!');
    console.log(`📦 Total products: ${products.length}`);
    console.log('🌿 Indoor plants: 5');
    console.log('🌻 Outdoor plants: 5');
    console.log('💊 Medicine plants: 4');
    console.log('🧪 Chemical products: 3');
    console.log('💰 All prices in Indian Rupees (₹)');
    mongoose.connection.close();
};

seedDB();
