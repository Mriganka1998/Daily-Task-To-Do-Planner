const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Email Verification",
    text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent to", email);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

const sendBookingSummaryEmail = async (email, htmlTable) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: "Your Movie Booking Summary",
    html: `<h3>Your Booking Summary</h3>${htmlTable}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Booking summary email sent to", email);
  } catch (error) {
    console.error("Error sending booking summary email:", error);
    throw error;
  }
};

module.exports = { sendOtpEmail, sendBookingSummaryEmail };
