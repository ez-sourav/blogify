const Blog = require("../models/blog");

async function checkBlogOwner(req, res, next) {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).send("Blog not found");
  }

  // compare owner
  if (blog.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).send("You are not allowed to do this");
  }

  // pass blog to next route
  req.blog = blog;
  next();
}

module.exports = { checkBlogOwner };
