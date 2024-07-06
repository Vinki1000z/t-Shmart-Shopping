const express = require("express");
const router = express.Router();

// order_schema cart_schema payment_schema
const Order = require("../../models/order_schema.js");
const Payment = require("../../models/payment_schema.js");

// Midlleware
const userVerification = require("../../middleware/userVerification.js");
const { header } = require("express-validator");

let success = false;

// /api/order/deleteOrder/:orderId
router.delete("/deleteOrder/:orderId", userVerification, async (req, res) => {
  try {
    const headerId = req.user.id;
    const orderId = req.params.orderId;
    const order = await Order.findOne({ _id: orderId, userId: headerId });

    if (headerId !== order.userId) {
      return res
        .status(400)
        .json({ success, msg: "You are not authorized to delete" });
    }
    // Find the associated payment
    const payment = await Payment.findOne({ orderId: order._id });
    if (payment && payment.deliveredStatus === "Pending") {
      // Delete the payment
      await Payment.deleteOne({ _id: payment._id });

      // Delete the order
      await Order.deleteOne({ _id: order._id });

      // Optionally, handle the cart status here if needed

      return res.json({
        msg: "Order and payment deleted successfully",
        success: true,
      });
    } else {
      return res
        .status(400)
        .json({
          msg: "Order cannot be deleted, delivery status is not pending",
          success: false,
        });
    }
  } catch (error) {
    res.json({ msg: error.message, success });
  }
});

module.exports = router;
