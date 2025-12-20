const axios = require("axios");

const sendSignupEmail = async (data) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Blogify",
          email: "bm5633302@gmail.com", // VERIFIED sender in Brevo
        },
        to: [
          {
            email: "projectperpose04@gmail.com", // where you want notifications
          },
        ],
        subject: "New Blogify Signup",
        textContent: `
New Blogify Signup

Name: ${data.name}
Email: ${data.email}
Signup Time: ${new Date().toLocaleString("en-IN")}
City: ${data.city}
Country: ${data.country}
Device: ${data.device}
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );
  } catch (err) {
    // ❗ SILENT FAIL (never block signup)
  }
};

module.exports = sendSignupEmail;
