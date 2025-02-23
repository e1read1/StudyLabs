const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user
// @access public

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Registration logic
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password });
    await user.save();

    // Generate JWT token
    const payload = { user: { id: user._id, role: user.role } };
    // Sign and return the token along with user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error generating token" });
        }

        //Send the user and token in response
        return res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// @route POST /api/users/login
// @desc Authenticate user
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    let user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = { user: { id: user._id, role: user.role } };
    // Sign and return the token along with user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error generating token" }); // ✅ Tambahkan return
        }

        //Send the user and token in response
        return res.json({
          // ✅ Pakai return
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// @route GET /api/users/profile
// @desc Get logged-in user's profile (Protected Route)
// @access private
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
