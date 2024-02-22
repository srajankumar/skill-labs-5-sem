const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const login = (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Compare passwords
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (!result) {
            return res.status(401).json({ error: "Invalid credentials" });
          }

          // Return some token or authentication response
          res.status(200).json({ message: "Login successful" });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

const register = (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  User.findOne({ username: username })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Hash password
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          // Create a new user
          const newUser = new User({
            username: username,
            password: hash,
          });

          // Save the new user
          newUser
            .save()
            .then(() => {
              res.status(201).json({ message: "User registered successfully" });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ error: "Error saving user data" });
            });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "Error hashing password" });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

module.exports = {
  login,
  register,
};
