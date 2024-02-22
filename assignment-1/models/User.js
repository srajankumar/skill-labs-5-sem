const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});

// Create a Mongoose model for User
const User = mongoose.model("User", userSchema);

module.exports = User;
