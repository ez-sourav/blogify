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
    // 1️⃣ Save user
    const user = new User({
      fullName,
      email,
      password,
    });

    await user.save();

    // 2️⃣ Respond immediately
    res.redirect('/');

    // 3️⃣ Background email (SAFE & NON-BLOCKING)
    setImmediate(async () => {
      try {
        const location = await getLocationFromIP(); // always returns Unknown

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
        // 🔕 Silent log (do NOT panic yourself)
        console.log("Signup email skipped");
      }
    });

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