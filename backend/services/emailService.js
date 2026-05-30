const nodemailer = require("nodemailer");
require("dotenv").config();

const sendDownAlertEmail = async (userEmail, endpoint, errorMessage) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email credentials missing. Skipping email alert.");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `API Down Alert - ${endpoint.name}`,
      html: `
        <h2>PulseAPI Alert</h2>
        <p>Your monitored API is currently down.</p>

        <table border="1" cellpadding="8" cellspacing="0">
          <tr>
            <td><strong>API Name</strong></td>
            <td>${endpoint.name}</td>
          </tr>
          <tr>
            <td><strong>URL</strong></td>
            <td>${endpoint.url}</td>
          </tr>
          <tr>
            <td><strong>Status</strong></td>
            <td>DOWN</td>
          </tr>
          <tr>
            <td><strong>Error</strong></td>
            <td>${errorMessage || "Unknown error"}</td>
          </tr>
          <tr>
            <td><strong>Time</strong></td>
            <td>${new Date().toLocaleString()}</td>
          </tr>
        </table>

        <p>Please check this endpoint as soon as possible.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Down alert email sent to ${userEmail}`);
  } catch (error) {
    console.log("Failed to send email alert:", error.message);
  }
};

module.exports = {
  sendDownAlertEmail,
};