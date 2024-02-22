const mongoose = require("mongoose"); // Import mongoose module
// Define the blog schema
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User who authored the blog post
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create a Mongoose model for Blog
const Blog = mongoose.model("Blog", blogSchema);

module.exports = {
  Blog,
};
