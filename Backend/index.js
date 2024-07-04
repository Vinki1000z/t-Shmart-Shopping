const express = require("express");
const app = express();
const port = 5000;

// connecting the db
const connect = require("./db");
connect();


//  use routers

//  1 Authentication

// 1.1 For user Authentication
app.use("/api/auth", require("./routers/auth/userAuth.js"));

//  1.2 For Google User Authentication
app.use("/api/auth",require("./routers/auth/googleAuth.js"))


// 2. For cart
// app.use("/api/cart", require("./routes/cart/cart.js"));

// 3. For order
// app.use("/api/order",require("./routers/order/order.js"))



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
