const mongoose = require('mongoose');

let isConnected = false; // Keep track of the connection status

async function connect() {
    if (isConnected) {
        console.log("Already connected to the database");
        return;
    }

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/t-shmart');
        isConnected = true;
        console.log("Connected To The Database");
    } catch (err) {
        console.log("Error In Connecting To The Database: " + err);
        throw err; // Rethrow the error after logging it
    }
}

connect().catch(err => console.error(err));

module.exports = connect;
