const { validateToken } = require("../services/authentication");
const User = require("../models/user");

function checkForAuthenticationCookie(cookieName) {
  return async (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      req.user = null;
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);

      //  full user details (fullName, email, etc.)
      const user = await User.findById(userPayload._id);

      req.user = user; 
    } catch (error) {
      req.user = null;
    }

    next();
  };
}

module.exports = {
  checkForAuthenticationCookie
};
