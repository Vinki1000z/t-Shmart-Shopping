const express = require("express");
const router = express.Router();

// express-validation
const { body, validationResult } = require("express-validator");

// order_schema cart_schema payment_schema
const Order = require("../../models/order_schema.js");
const Cart = require("../../models/cart_schema.js");
const Payment = require("../../models/payment_schema.js");

// Midlleware
const userVerification = require("../../middleware/userVerification.js");
const { wait } = require("@testing-library/user-event/dist/utils/index.js");
let success = false;

// /api/order/makeOrder
router.post(
  "/makeOrder",
  userVerification,
  [
    body("address.street")
      .isLength({ min: 1 })
      .withMessage("Street is required"),
    body("address.city").isLength({ min: 1 }).withMessage("City is required"),
    body("address.state").isLength({ min: 1 }).withMessage("State is required"),
    body("address.country")
      .isLength({ min: 1 })
      .withMessage("Country is required"),
    body("address.zip").isPostalCode("any").withMessage("Invalid ZIP code"),
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
        userId
      });
      await order.save();

      //  making the payment schema

      // Calculate delivery date (e.g., 7 days from now)
      const {delivereDays,paymentMethod }=req.body; // Number of days for delivery
      const delivereDate = new Date();
      delivereDate.setDate(delivereDate.getDate() + Number(delivereDays));

      const payment = new Payment({
        orderId: order._id,
        amount: amount,
        paymentMethod,
        delivereDate,
        // transactionId set after the payment
        // paymentDate   set after the payment
        createdBy: req.user.id,
      });

      //  set the payment id in the order schema
      await payment.save();
      order.paymentId = payment._id;
      await order.save();

      // empty cart after the order
      cart.status = "empty";
      cart.dateUpdated = Date.now();
      await cart.save();
      success = true;
      res.json({ msg: order, payment, success });
    } catch (error) {
      res.json({ msg: error.message, success });
    }
  }
);

module.exports = router;
