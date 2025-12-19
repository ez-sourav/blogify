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

router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const user = new User({
      fullName,
      email,
      password,
    });

    await user.save();

    // SEND RESPONSE FIRST (IMPORTANT)
    res.redirect('/');

    // BACKGROUND TASK (NON-BLOCKING)
    (async () => {
      try {
        // Handle localhost IP in dev
        let ipForLocation = req.userIP;
        if (ipForLocation === "::1" || ipForLocation === "127.0.0.1") {
          ipForLocation = "49.37.12.45"; // dev test IP
        }

        const location = await getLocationFromIP(ipForLocation);

        await sendSignupEmail({
          name: user.fullName,
          email: user.email,
          ip: req.userIP,
          device: req.headers["user-agent"],
          city: location.city,
          region: location.region,
          country: location.country,
        });
      } catch (err) {
        console.error("Signup email/location failed:", err.message);
      }
    })();

  } catch (error) {
    if (error.code === 11000) {
      return res.render('signup', {
        error: "Email already exists. Please use another email.",
      });
    }

    return res.render('signup', {
      error: "Something went wrong. Please try again.",
    });
  }
});


module.exports = router;