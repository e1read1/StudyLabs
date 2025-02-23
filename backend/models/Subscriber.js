const mongoose = require("mongoose");

subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  subscribeAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
