const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  createBlog,
  getBlogByAuthorId,
} = require("../controllers/blogController");
const { validateAuthorId } = require("../middleware/authMiddleware");

router.get("/", getAllBlogs);
router.post("/", createBlog);
router.get("/:authorId", validateAuthorId, getBlogByAuthorId);

module.exports = router;
