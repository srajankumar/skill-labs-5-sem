const mongoose = require("mongoose");
require("dotenv").config();
const { Blog } = require("../models/Blog"); // Update the path to your blog model
const User = require("../models/User"); // Import your User model

const { getCachedData, cacheData } = require("../middleware/cache");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const getAllBlogs = async (req, res) => {
  const cachedBlogs = getCachedData("allBlogs");
  if (cachedBlogs) {
    return res.status(200).json(cachedBlogs);
  }

  try {
    const blogs = await Blog.find();
    cacheData("allBlogs", blogs);
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching blogs" });
  }
};

const createBlog = async (req, res) => {
  const { authorId, title, category, content } = req.body;

  try {
    const newBlog = await Blog.create({ authorId, title, category, content });
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
  const cacheKey = `authorBlogs_${authorId}`;

  const cachedBlogs = getCachedData(cacheKey);
  if (cachedBlogs) {
    return res.status(200).json(cachedBlogs);
  }

  try {
    const authorBlogs = await Blog.find({ authorId: authorId });
    cacheData(cacheKey, authorBlogs);
    res.status(200).json(authorBlogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching blogs by author ID" });
  }
};

const searchBlogs = async (req, res) => {
  const query = req.query.q;
  const cacheKey = `searchResults_${query}`;

  const cachedBlogs = getCachedData(cacheKey);
  if (cachedBlogs) {
    return res.status(200).json(cachedBlogs);
  }

  try {
    const matchingBlogs = await Blog.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    });
    cacheData(cacheKey, matchingBlogs);
    res.status(200).json(matchingBlogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error searching blogs" });
  }
};

const subscribeUserToBlog = async (req, res) => {
  const { userId } = req.body;
  const { blogId } = req.params;

  try {
    // Find the user and the blog
    const user = await User.findById(userId);
    const blog = await Blog.findById(blogId);

    if (!user || !blog) {
      return res.status(404).json({ error: "User or blog not found" });
    }

    // Add the user to the blog's subscribers array
    blog.subscribers.push(userId);
    await blog.save();

    // Add the blog to the user's subscribedBlogs array
    user.subscribedBlogs.push(blogId);
    await user.save();

    res.status(200).json({ message: "User subscribed to blog successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBlogsByCategory = async (req, res) => {
  const { categoryName } = req.params;

  try {
    // Query the database to find blog posts with the specified category
    const blogs = await Blog.find({ category: categoryName });

    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching blog posts by category" });
  }
};

const getBlogsInDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    // Convert start and end date strings to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Query the database to find all blog posts within the specified date range
    const posts = await Blog.find({
      createdAt: { $gte: start, $lte: end },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error fetching blog posts within date range" });
  }
};

const getBlogsWithReviewStats = async (req, res) => {
  try {
    const authorId = req.params.authorId;

    const aggregationPipeline = [
      {
        $match: {
          activeSubscriber: true,
        },
      },
      {
        $group: {
          _id: "$authorId",
          totalBlogs: { $sum: 1 },
          blogTitle: { $first: "$blogTitle" },
          avgBlogLength: { $avg: { $strLenCP: "$blogContent" } },
        },
      },
      {
        $sort: {
          totalBlogs: -1,
        },
      },
      {
        $project: {
          _id: 0,
          authorId: "$_id",
          totalBlogs: 1,
          blogTitle: 1,
          avgBlogLength: 1,
        },
      },
    ];
    const aggregateData = await Blog.aggregate(aggregationPipeline).exec();
    console.log(aggregateData);
    res.json(aggregateData);
  } catch (error) {
    console.error("Error fetching total blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllBlogs,
  createBlog,
  getBlogByAuthorId,
  searchBlogs,
  subscribeUserToBlog,
  getBlogsByCategory,
  getBlogsInDateRange,
  getBlogsWithReviewStats,
};
