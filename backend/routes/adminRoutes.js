const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/users
// @desc Get all users (Admin Route)
// @access private/admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/admin/users
// @desc Create a new user (Admin Route)
// @access private/admin

router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // check for existing user
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // create new user
    user = new User({ name, email, password, role: role || "customer" });
    await user.save();
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/admin/users/:id
// @desc Update user info
// @access private/admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
    }
    const updateUser = await user.save();
    return res.json({ message: "User updated successfully", user: updateUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/admin/users/:id
// @desc Delete user
// @access private/admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      return res.json({ message: "User deleted successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
