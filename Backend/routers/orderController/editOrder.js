const express = require("express");
const router = express.Router();

// order_schema cart_schema payment_schema
const Order = require("../../models/order_schema.js");
const Payment = require("../../models/payment_schema.js");

// Midlleware
const userVerification = require("../../middleware/userVerification.js");

let success = false;

// /api/order/editOrder/:orderId
router.put("/editOrder/:orderId", userVerification, async (req, res) => {
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
    const {address}=req.body;
    const payment = await Payment.findOne({ orderId: order._id });
    if (payment && payment.deliveredStatus === "Pending") {
        order.address = address;
        await order.save();
      return res.json({
        msg: "Order and payment been successfully updated", order,
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
