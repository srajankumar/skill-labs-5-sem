// Assuming you have a UserController module with the getAllUsers function
const User = require("../models/User"); // Import your User model

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users); // Respond with the fetched users
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.userId; // Extract userId from request parameters
  try {
    const user = await User.findById(userId); // Fetch user by ID from the database
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Handle case where user is not found
    }
    res.status(200).json(user); // Respond with the fetched user
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user" });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId; // Extract userId from request parameters
  try {
    const deletedUser = await User.findByIdAndDelete(userId); // Find user by ID and delete from the database
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" }); // Handle case where user is not found
    }
    res.status(200).json({ message: "User deleted successfully" }); // Respond with success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting user" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
};
