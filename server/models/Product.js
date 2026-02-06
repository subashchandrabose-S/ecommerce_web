const { db } = require('../config/db');

class Product {
    constructor(data) {
        this.id = data.id || null;
        this.name = data.name;
        this.description = data.description;
        this.price = Number(data.price);
        this.category = data.category;
        this.subCategory = data.subCategory;
        this.image = data.image;
        this.stock = Number(data.stock || 0);
        this.featured = data.featured || false;
        this.createdAt = data.createdAt || new Date();
    }

    static async find() {
        const snapshot = await db.collection('products').get();
        return snapshot.docs.map(doc => new Product({ id: doc.id, ...doc.data() }));
    }

    static async findById(id) {
        if (!id) return null;
        const doc = await db.collection('products').doc(id).get();
        if (!doc.exists) return null;
        return new Product({ id: doc.id, ...doc.data() });
    }

    static async findByIdAndUpdate(id, data, options) {
        if (!id) return null;
        await db.collection('products').doc(id).set(data, { merge: true });
        // Fetch specific fields or return merged data?
        // Logic to return updated document
        return Product.findById(id);
    }

    static async findByIdAndDelete(id) {
        if (!id) return;
        await db.collection('products').doc(id).delete();
    }

    async save() {
        const productData = {
            name: this.name,
            description: this.description,
            price: this.price,
            category: this.category,
            subCategory: this.subCategory || '',
            image: this.image,
            stock: this.stock,
            featured: this.featured,
            createdAt: this.createdAt
        };

        if (this.id) {
            await db.collection('products').doc(this.id).set(productData, { merge: true });
        } else {
            const res = await db.collection('products').add(productData);
            this.id = res.id;
        }
        return this;
    }
}

module.exports = Product;
