const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"TransiSNG" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};

const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to TransiSNG!';
  const html = `
    <h1>Welcome to TransiSNG, ${user.name}!</h1>
    <p>Thank you for registering with us. We're excited to help you with your transportation needs.</p>
    <p>Start by posting your first cargo or browsing available shipments.</p>
    <br>
    <p>Best regards,<br>TransiSNG Team</p>
  `;

  await sendEmail(user.email, subject, html);
};

const sendCargoStatusEmail = async (user, cargo, status) => {
  const subject = `Your cargo status has been updated to ${status}`;
  const html = `
    <h1>Cargo Status Update</h1>
    <p>Your cargo "${cargo.title}" has been ${status}.</p>
    ${status === 'rejected' && cargo.rejectionReason ? 
      `<p><strong>Reason:</strong> ${cargo.rejectionReason}</p>` : ''}
    <p>You can view the details in your dashboard.</p>
    <br>
    <p>Best regards,<br>TransiSNG Team</p>
  `;

  await sendEmail(user.email, subject, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendCargoStatusEmail
};