const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function() { return !this.googleId; } },  // Required if not using Google Auth
    googleId: { type: String, unique: true, sparse: true },  // Sparse index allows multiple null values
    // googleToken: { type: String },  // Optional field for storing Google access token
    date: { type: Date, default: Date.now },
    isGoogleUser: { type: Boolean, default: false }  // Flag to indicate Google auth


    // I will add This later
    // Maybe during the order time

    // address: {
    //     street: { type: String },
    //     city: { type: String },
    //     state: { type: String },
    //     country: { type: String },
    //     zip: { type: String }
    // },
    // role: { type: String, enum: ['user', 'admin'], default: 'user' },
    
});

userSchema.pre('save', function(next) {
    if (!this.googleId && !this.password) {
        next(new Error('Either password or googleId must be provided'));
    } else {
        next();
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
