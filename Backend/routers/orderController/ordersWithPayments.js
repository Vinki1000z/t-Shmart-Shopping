const express = require("express");
const router = express.Router();

// order_schema cart_schema payment_schema
const Order = require("../../models/order_schema.js");

// Midlleware
const userVerification = require("../../middleware/userVerification.js");

let success = false;

// /api/order/ordersWithPayments
router.get("/ordersWithPayments", userVerification, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch orders for the user with their associated payments
    const orders = await Order.find({ userId }).populate('paymentId');

    if (!orders) {
      return res.status(404).json({ msg: 'No orders found', success: false });
    }

    res.json({ msg:"All the ordersWithPayments",orders, success: true });
  } catch (error) {
    res.json({ msg: error.message, success });
  }
});

module.exports = router;
