const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Fallback product data when Firebase is unavailable
const fallbackProducts = [
    // Indoor Plants
    {
        id: 'fallback-1',
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
        id: 'fallback-2',
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
        id: 'fallback-3',
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
        id: 'fallback-4',
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
        id: 'fallback-5',
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
        id: 'fallback-6',
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
        id: 'fallback-7',
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
        id: 'fallback-8',
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
        id: 'fallback-9',
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
        id: 'fallback-10',
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
        id: 'fallback-11',
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
        id: 'fallback-12',
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
        id: 'fallback-13',
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
        id: 'fallback-14',
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
        id: 'fallback-15',
        name: 'All-Purpose Fertilizer',
        description: 'Balanced 10-10-10 formula for healthy growth in all plants.',
        price: 999,
        category: 'Chemical',
        image: 'https://images.unsplash.com/photo-1628676726581-2c1b87f2c6e6?auto=format&fit=crop&w=600&q=80',
        stock: 200,
        featured: false
    },
    {
        id: 'fallback-16',
        name: 'Neem Oil Spray',
        description: 'Organic pesticide and fungicide. Keeps pests away naturally.',
        price: 1299,
        category: 'Chemical',
        image: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=600&q=80',
        stock: 150,
        featured: true
    },
    {
        id: 'fallback-17',
        name: 'Rooting Hormone',
        description: 'Stimulates root growth for cuttings. Propagate your plants faster.',
        price: 849,
        category: 'Chemical',
        image: 'https://plus.unsplash.com/premium_photo-1679516785093-660168393850?auto=format&fit=crop&w=600&q=80',
        stock: 100,
        featured: false
    }
];

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        if (products && products.length > 0) {
            res.json(products);
        } else {
            // Return fallback data if database is empty or unavailable
            console.log('Using fallback product data (Firebase returned 0 products)');
            res.json(fallbackProducts);
        }
    } catch (err) {
        // If Firebase fails, return fallback data instead of error
        console.error('Firebase error, using fallback data:', err.message);
        res.json(fallbackProducts);
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            // Check fallback data
            const fallback = fallbackProducts.find(p => p.id === req.params.id);
            if (fallback) return res.json(fallback);
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        // Check fallback data
        const fallback = fallbackProducts.find(p => p.id === req.params.id);
        if (fallback) return res.json(fallback);
        res.status(500).json({ message: err.message });
    }
});

// Create product (Admin only - middleware to be added)
router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        subCategory: req.body.subCategory,
        image: req.body.image,
        stock: req.body.stock,
        featured: req.body.featured
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
