const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS,
  },
});

const sendSignupEmail = async ({
  name,
  email,
  ip,
  device,
  city,
  region,
  country,
}) => {
  const signupTime = new Date().toLocaleString("en-IN");

  const message = `
New Blogify Signup

Name: ${name}
Email: ${email}
Signup Time: ${signupTime}
IP Address: ${ip}
City: ${city}
Region: ${region}
Country: ${country}
Device: ${device}
`;

  await transporter.sendMail({
    from: `"Blogify" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "New Blogify Signup",
    text: message,
  });
};


module.exports = sendSignupEmail;
