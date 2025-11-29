const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Nursery', 'Chemical', 'Other'],
    },
    subCategory: {
        type: String,
        enum: ['Indoor', 'Outdoor', 'Medicine', 'Other'],
    },
    image: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    featured: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
