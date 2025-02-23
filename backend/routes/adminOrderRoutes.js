const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/orders
// @description Get all orders (Admin only)
// @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    return res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT /api/admin/orders/:id
// @description Update order status (Admin only)
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");
    if (order) {
      order.status = req.body.status || order.status;
      order.isDelivered =
        req.body.status === "Delivered" ? true : order.isDelivered;
      order.deliveredAt =
        req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    } else {
      return res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route DELETE /api/admin/orders/:id
// @description delete order (Admin only)
// @access Private/Admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      return res.json({ message: "Order removed" });
    } else {
      return res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
