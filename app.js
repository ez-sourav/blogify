require('dotenv').config()
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')

const Blog = require('./models/blog')

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT ||  3000;

mongoose
  // .connect("mongodb://localhost:27017/blogify")
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("MongoDb Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ADD THIS BLOCK (IP CAPTURE)
app.set("trust proxy", true);
app.use((req, res, next) => {
  req.userIP =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;
  next();
});

app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});

  res.render("home", {
    user: req.user,
    blogs: allBlogs,
    deleted: req.query.deleted === "true",
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log("Server Started ", PORT);
});
