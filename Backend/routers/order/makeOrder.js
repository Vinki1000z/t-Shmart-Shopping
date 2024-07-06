const express = require("express");
const router = express.Router();

// express-validation
const { body, validationResult } = require("express-validator");

// order_schema and cart_schema
const Order = require("../../models/order_schema.js");
const Cart = require("../../models/cart_schema.js");

// Midlleware
const userVerification = require("../../middleware/userVerification.js");
let success = false;

// /api/cart/showCart
router.post(
  "/makeOrder",
  userVerification,
  [
    body('address.street').isLength({ min: 1 }).withMessage('Street is required'),
    body('address.city').isLength({ min: 1 }).withMessage('City is required'),
    body('address.state').isLength({ min: 1 }).withMessage('State is required'),
    body('address.country').isLength({ min: 1 }).withMessage('Country is required'),
    body('address.zip').isPostalCode('any').withMessage('Invalid ZIP code'),
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let triversing = errors.array();
        let error = triversing.map((err) => err.msg);
        return res.status(400).json({ msg: error, success });
      }
  
    try {
      const userId = req.user.id;
      let cart = await Cart.findOne({ userId, status: "active" });
      if (cart == null) {
        success = true;
        return res.json({ msg: "Plz Add Some Items", success });
      }

      const { address } = req.body;
      //  making the order
      let amount = 0;
      const allItems = cart.items;
      for (item in allItems) {
        amount += allItems[item].price * allItems[item].quantity;
      }
      const order = new Order({
        cart,
        amount,
        address,
      });
      await order.save();
      // empty cart after the order
      cart.status = "empty";
      cart.dateUpdated = Date.now();
      await cart.save();
      success = true;
      res.json({ msg: order, success });
    } catch (error) {
      res.json({ msg: error.message, success });
    }
  }
);

module.exports = router;
