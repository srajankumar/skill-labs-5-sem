const fs = require("fs");
const blogs = require("../data/blogs.json");

const getAllBlogs = (req, res) => {
  res.status(200).json(blogs);
};

const createBlog = (req, res) => {
  const { authorId, title, content } = req.body;

  const newBlog = {
    id: blogs.length + 1,
    authorId,
    title,
    content,
  };

  blogs.push(newBlog);

  fs.writeFile("./data/blogs.json", JSON.stringify(blogs), (err) => {
    if (err) {
      return res.status(500).json({ error: "Error saving blog data" });
    }
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  });
};

const getBlogByAuthorId = (req, res) => {
  const authorId = parseInt(req.params.authorId);
  const authorBlogs = blogs.filter((blog) => blog.authorId === authorId);
  res.status(200).json(authorBlogs);
};

module.exports = {
  getAllBlogs,
  createBlog,
  getBlogByAuthorId,
};
