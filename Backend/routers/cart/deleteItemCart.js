const express = require("express");
const router = express.Router();
// cart_schema
const Cart = require("../../models/cart_schema.js");

// Midlleware
const userVerification = require("../../middleware/userVerification.js");
let success = false;

// /api/cart/showCart
router.post("/deleteItemCart", userVerification, async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId, status: "active" });
    if (cart == null) {
      success = true;
      return res.json({ msg: "Plz Add Some Items", success });
    }

    const { productId, quantity} = req.body;

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );
    const currentQuantity=cart.items[existingItemIndex].quantity;
    if(currentQuantity-quantity<=0){
      cart.items.splice(existingItemIndex, 1);
    }
    else{
      cart.items[existingItemIndex].quantity=currentQuantity-quantity;
      }
      cart.dateUpdated = Date.now();
      await cart.save();
      success = true;
      return res.json({ msg: "Item Deleted", success });
  } catch (error) {
    res.json({ msg: error.message, success });
  }
});

module.exports = router;
