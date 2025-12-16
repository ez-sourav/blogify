const { Router } = require("express");
const { requireLogin } = require("../middlewares/requireLogin");
const upload = require("../middlewares/upload");

const Blog = require("../models/blog");
const Comment = require("../models/comment");
const router = Router();

router.get("/add-new", requireLogin, (req, res) => {
  return res.render("addBlogs", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );

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
