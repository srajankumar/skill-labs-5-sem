const bcrypt = require("bcrypt");
const users = require("../data/users.json");

const authenticate = (req, res, next) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.user = user;
    next();
  });
};

const validateAuthorId = (req, res, next) => {
  const authorId = parseInt(req.params.authorId);
  if (Number.isNaN(authorId)) {
    return res.status(400).json({ error: "Invalid author ID" });
  }
  next();
};

module.exports = {
  validateAuthorId,
};
