const express = require("express");
const app = express();
const port = 5000;

// connecting the db
const connect = require("./db");
connect();

//  Point 1. add this
// Middleware to parse JSON bodies
app.use(express.json());
//  use routers

//  1 Authentication

// 1.1 SingUp
app.use("/api/auth", require("./routers/auth/singUp.js"));

//  1.2 Google User Authentication
app.use("/api/auth",require("./routers/auth/googleAuth.js"))

//  1.3 Login
app.use("/api/auth",require("./routers/auth/logIn.js"))

//  1.4 UserVerification
app.use("/api/auth",require("./routers/auth/userVerification.js"))

//  1.5 For logout (Do it in the last)
// app.use("/api/auth",require("./routers/auth/logOut.js"))


// 2. Cart

// 2.1 createcart
app.use("/api/cart", require("./routers/cart/addItemCart.js"));

// 2.2 showCart
app.use("/api/cart", require("./routers/cart/showCart.js"));

// 2.3 deletitemCart
app.use("/api/cart", require("./routers/cart/deleteItemCart.js"));

// 3. For order
// app.use("/api/order",require("./routers/order/order.js"))



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
