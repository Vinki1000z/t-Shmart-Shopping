    const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the CartItem schema
const cartItemSchema = new Schema({
    productId: { type: String, required: true }, // Assuming product ID from external API is a string
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

// Define the Cart schema
const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [cartItemSchema],
    status: { type: String, default: 'active' },
    date: { type: Date, default: Date.now },
    dateUpdated: { type: Date, default: Date.now },
    // sessionId: { type: String }, 
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
