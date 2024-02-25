const mongoose = require("mongoose");

const userBlogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
});

const UserBlog = mongoose.model("UserBlog", userBlogSchema);

module.exports = UserBlog;
