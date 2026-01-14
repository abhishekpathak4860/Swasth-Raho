// import nodemailer from "nodemailer";

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: `"Swasth Raho Support" <${process.env.EMAIL_USERNAME}>`,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   await transporter.sendMail(mailOptions);
// };

// export default sendEmail;

import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // 1. Validate Env Vars
  if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
    throw new Error(
      "❌ EMAIL_USERNAME or EMAIL_PASSWORD missing in Environment Variables"
    );
  }

  // 2. Create Transporter (Using Port 587 - More reliable for Cloud Servers)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // 587 is standard for TLS
    secure: false, // Must be false for port 587 (it upgrades via STARTTLS)
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Helps avoid certificate issues on some cloud servers
    },
    // Debugging settings
    logger: true,
    debug: true,
    connectionTimeout: 10000, // Fail fast if it can't connect (10 seconds)
  });

  const mailOptions = {
    from: `"Swasth Raho Support" <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Nodemailer Failed:", error);
    throw new Error(`Email Error: ${error.message}`);
  }
};

export default sendEmail;
