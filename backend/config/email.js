const nodemailer = require("nodemailer");

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email function
const sendEmail = async (options) => {
  const transporter = createTransport();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
};

// Email templates
const getWelcomeEmailTemplate = (name, email, tempPassword) => {
  return {
    subject: "Welcome to Agent Management System",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Agent Management System!</h2>
        <p>Hello ${name},</p>
        <p>Your admin account has been created successfully. Here are your login credentials:</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>
        <p>Please log in and change your password immediately for security reasons.</p>
        <p><a href="${process.env.CLIENT_URL}/login" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a></p>
        <p>Best regards,<br>Agent Management Team</p>
      </div>
    `,
  };
};

const getPasswordResetTemplate = (name, resetUrl) => {
  return {
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>You requested a password reset for your Agent Management System account.</p>
        <p>Click the button below to reset your password:</p>
        <p><a href="${resetUrl}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Agent Management Team</p>
      </div>
    `,
  };
};

module.exports = {
  sendEmail,
  getWelcomeEmailTemplate,
  getPasswordResetTemplate,
};
