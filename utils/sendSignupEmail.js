const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,            // ✅ Brevo
  port: Number(process.env.SMTP_PORT),    // ✅ 587
  secure: false,                          // TLS
  auth: {
    user: process.env.SMTP_USER,          // ✅ Brevo login
    pass: process.env.SMTP_PASS,          // ✅ Brevo password
  },
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
    from: `Blogify <${process.env.ADMIN_EMAIL}>`, // ✅ verified sender
    to: process.env.ADMIN_EMAIL,
    subject: "New Blogify Signup",
    text: message,
  });
};

module.exports = sendSignupEmail;
