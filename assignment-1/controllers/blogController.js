const mongoose = require("mongoose");
require("dotenv").config();

// Define the blog schema
const blogSchema = new mongoose.Schema({
  authorId: Number,
  title: String,
  content: String,
});

// Create a Mongoose model
const Blog = mongoose.model("Blog", blogSchema);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching blogs" });
  }
};

const createBlog = async (req, res) => {
  const { authorId, title, content } = req.body;

  try {
    const newBlog = await Blog.create({ authorId, title, content });
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating blog" });
  }
};

const getBlogByAuthorId = async (req, res) => {
  const authorId = parseInt(req.params.authorId);
  try {
    const authorBlogs = await Blog.find({ authorId: authorId });
    res.status(200).json(authorBlogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching blogs by author ID" });
  }
};

module.exports = {
  getAllBlogs,
  createBlog,
  getBlogByAuthorId,
};
