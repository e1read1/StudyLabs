const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

// @route POST api/subscribe
// @description Handle newsletter subscription
// @access public

router.post("/subscriber", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please provide an email" });
  }

  try {
    // Check if the email already exists in the database
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ msg: "Email already subscribed" });
    }

    // Create a new subscriber
    subscriber = new Subscriber({ email });
    await subscriber.save();

    res
      .status(201)
      .json({ message: "Email subscribed successfully to the newsletter" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
