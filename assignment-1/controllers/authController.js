const fs = require("fs");
const bcrypt = require("bcrypt");
const users = require("../data/users.json");

const login = (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Return some token or authentication response
    res.status(200).json({ message: "Login successful" });
  });
};

const register = (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }

  // Hash password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: "Error hashing password" });
    }

    // Add new user to the users array
    const newUser = {
      id: users.length + 1,
      username: username,
      password: hash,
    };

    users.push(newUser);

    // Save the updated user data
    fs.writeFile("./data/users.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error saving user data" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  });
};

module.exports = {
  login,
  register,
};
