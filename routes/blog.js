const { Router } = require("express");
const { requireLogin } = require("../middlewares/requireLogin");
const upload = require("../middlewares/upload");

const Blog = require("../models/blog");
const Comment = require("../models/comment");
const router = Router();
const mongoose = require("mongoose");

// edit blog

const { checkBlogOwner } = require("../middlewares/checkBlogOwner");

router.get(
  "/edit/:id",
  requireLogin,
  checkBlogOwner,
  (req, res) => {
    res.render("editBlog", {
      user: req.user,
      blog: req.blog,
    });
  }
);

router.post(
  "/edit/:id",
  requireLogin,
  checkBlogOwner,
  upload.single("coverImage"),
  async (req, res) => {
    const { title, body } = req.body;

    const updateData = {
      title,
      body,
    };

    // if new image uploaded
    if (req.file) {
      updateData.coverImageURL = req.file.path;
    }

    await Blog.findByIdAndUpdate(req.params.id, updateData);

    res.redirect(`/blog/${req.params.id}`);
  }
);




// delete blog

router.post(
  "/delete/:id",
  requireLogin,
  checkBlogOwner,
  async (req, res) => {
    await req.blog.deleteOne();
    res.redirect("/");
  }
);

router.get("/add-new", requireLogin, (req, res) => {
  return res.render("addBlogs", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  //  Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).render("404", {
      user: req.user,
      message: "Blog not found or invalid URL",
    });
  }

  // Query DB safely
  const blog = await Blog.findById(id).populate("createdBy");

  if (!blog) {
    return res.status(404).render("404", {
      user: req.user,
      message: "Blog not found or has been deleted",
    });
  }

  const comments = await Comment.find({ blogId: id })
    .populate("createdBy");

  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/comment/:blogId",requireLogin, async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/",requireLogin,upload.single("coverImage"),async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
      body,
      title,
      createdBy: req.user._id,
      coverImageURL: req.file.path,
    });
    return res.redirect(`/blog/${blog._id}`);
  }
);

module.exports = router;
