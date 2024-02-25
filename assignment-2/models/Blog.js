const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  subscribedUserId: String,
  activeSubscriber: Boolean,
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = {
  Blog,
};
