const {Router} = require('express')
const User = require('../models/user')
const sendSignupEmail = require("../utils/sendSignupEmail");
const getLocationFromIP = require("../utils/getLocationFromIP");

const router = Router();

router.get('/signin',(req,res)=>{
    return res.render('signin')
})

router.get('/signup',(req,res)=>{
    return res.render('signup')
})

router.post('/signin', async (req, res) => {
  const {email, password } = req.body;
  try {
  const token = await User.matchPasswordAndGenerateToken(email,password);
  
  return res.cookie('token',token).redirect('/');
  } catch (error) {
    return res.render('signin',{
      error:"Incorrect Email or Password",
    })
  }
});

router.get('/logout',(req,res)=>{
  res.clearCookie('token').redirect('/')
})

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const user = new User({ fullName, email, password });
    await user.save();

    // respond immediately
    res.redirect("/");

    // fire-and-forget notification (Render safe)
    process.nextTick(() => {
      sendSignupEmail({
        name: user.fullName,
        email: user.email,
        city: "Unknown",
        country: "Unknown",
        device: req.headers["user-agent"],
      });
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.render("signup", {
        error: "Email already exists. Please use another email.",
      });
    }

    return res.render("signup", {
      error: "Something went wrong. Please try again.",
    });
  }
});



module.exports = router;