const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  createBlog,
  getBlogByAuthorId,
  searchBlogs,
  subscribeUserToBlog,
} = require("../controllers/blogController");
const { validateAuthorId } = require("../middleware/authMiddleware");

// Route for searching blogs
router.get("/search", searchBlogs); // Define a new route for searching blogs

// Existing routes
router.get("/", getAllBlogs);
router.post("/", createBlog);
router.get("/:authorId", validateAuthorId, getBlogByAuthorId);

router.post("/:blogId/subscribe", subscribeUserToBlog);

module.exports = router;
