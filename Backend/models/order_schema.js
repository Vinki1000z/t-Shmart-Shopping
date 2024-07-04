const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Reference to the Cart schema
// const Cart = require('./Cart'); // Adjust the path as needed

// Define the Order schema
const orderSchema = new Schema({
    cart: { type: Schema.Types.ObjectId, ref: 'Cart', required: true }, // Reference to the Cart
    amount: { type: Number, required: true },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        zip: { type: String }
    },
    // status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    // paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    date: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
