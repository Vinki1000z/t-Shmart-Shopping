const express = require("express");
const router = express.Router();
// cart_schema
const Cart = require("../../models/cart_schema.js");

// Midlleware
const userVerification = require("../../middleware/userVerification.js");
let success = false;

// /api/cart/showCart
router.get("/showCart", userVerification, async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId, status: "active" });
    if (cart == null) {
      success = true;
      return res.json({ msg: "Plz Add Some Items", success });
    }

    success = true;
    res.json({ msg: cart, success });
  } catch (error) {
    res.json({ msg: error.message, success });
  }
});

module.exports = router;
