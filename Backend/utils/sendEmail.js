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
  // 1. Create Transporter with Explicit Port 465
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Explicit host
    port: 465, // Secure port (Works on Render)
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD, // Must be 16-char App Password
    },
  });

  const mailOptions = {
    from: `"Swasth Raho Support" <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 2. Add Error Logging to see if it works
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Nodemailer Failed:", error);
    // Throw error so the controller knows it failed
    throw new Error(error.message);
  }
};

export default sendEmail;
