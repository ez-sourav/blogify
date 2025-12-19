const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,           // smtp-relay.brevo.com
  port: Number(process.env.SMTP_PORT),   // 587
  secure: false,                         // MUST be false for 587
  requireTLS: true,                      // 🔥 IMPORTANT for Render
  auth: {
    user: process.env.SMTP_USER,         // Brevo login
    pass: process.env.SMTP_PASS,         // Brevo password
  },
  connectionTimeout: 10000,              // 🔥 Prevent hanging
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Optional but very useful: check SMTP at startup
transporter.verify((error) => {
  if (error) {
    console.log("Brevo SMTP not ready:", error.message);
  } else {
    console.log("Brevo SMTP ready");
  }
});

const sendSignupEmail = async (data) => {
  console.log("📨 sendSignupEmail() CALLED");
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
  from: "Blogify <bm5633302@gmail.com>",   // VERIFIED sender
  to: "projectperpose04@gmail.com",        // WHERE YOU WANT DETAILS
  subject: "New Blogify Signup",
  text: message,
});

};

module.exports = sendSignupEmail;
