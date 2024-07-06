const express = require("express");
const router = express.Router();
// cart_schema
const Cart = require("../../models/cart_schema.js");

// Midlleware
const userVerification = require("../../middleware/userVerification.js");
let success = false;

// /api/cart/addItem
router.post("/addItem", userVerification, async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId, status: "active" });
    if (cart == null) {
      cart = new Cart({ userId, items: [], status: "active" });
    }
    const { productId, quantity, price } = req.body;
    // console.log(productId,quantity,price);
    const existingItemIndex = cart.items.findIndex((item) =>
      item.productId === productId
    );

    if (existingItemIndex !== -1) {
      // Update quantity if product already exists in the cart
      //    HTTP request bodies typically contain all values as strings.
      cart.items[existingItemIndex].quantity += Number(quantity);
    } else {
      // Add new product to the cart
      cart.items.push({ productId, quantity:Number(quantity), price });
    }
    cart.dateUpdated = Date.now();
    await cart.save();
    success = true;
    res.json({ msg: "Saved Into Cart", success });
  } catch (error) {
    res.json({ msg: error.message, success });
  }
});

module.exports = router;
