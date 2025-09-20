const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    console.log('SMS sent successfully to:', to);
  } catch (error) {
    console.error('SMS sending error:', error);
    throw new Error('Failed to send SMS');
  }
};

const sendVerificationCode = async (phone, code) => {
  const message = `Your TransiSNG verification code is: ${code}. It will expire in 10 minutes.`;
  await sendSMS(phone, message);
};

const sendCargoAssignedSMS = async (driverPhone, cargo) => {
  const message = `You have been assigned to a new cargo: ${cargo.title} from ${cargo.from.city} to ${cargo.to.city}. Check your dashboard for details.`;
  await sendSMS(driverPhone, message);
};

module.exports = {
  sendSMS,
  sendVerificationCode,
  sendCargoAssignedSMS
};