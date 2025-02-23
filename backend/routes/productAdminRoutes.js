const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/products
// @description Get all products (admin only)
// @access private/admin

router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route POST /api/products

module.exports = router;
