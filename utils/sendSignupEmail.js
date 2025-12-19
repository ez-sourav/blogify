const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS,
  },
  connectionTimeout: 10000, // ⏱️ 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendSignupEmail = async (data) => {
  const signupTime = new Date().toLocaleString("en-IN");

  const message = `
New Blogify Signup

Name: ${data.name}
Email: ${data.email}
Signup Time: ${signupTime}
IP Address: ${data.ip}
City: ${data.city}
Region: ${data.region}
Country: ${data.country}
Device: ${data.device}
`;

  await transporter.sendMail({
    from: `"Blogify" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "New Blogify Signup",
    text: message,
  });
};

module.exports = sendSignupEmail;
