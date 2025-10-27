const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioPhone = process.env.TWILIO_PHONE;
const adminPhone = process.env.ADMIN_PHONE; // Your WhatsApp Number

const sendWhatsAppAlert = async (name, photo, location) => {
  try {
    const message = `⚠️ ALERT: ${name} detected!\n📍 Location: ${JSON.stringify(location)}\n📸 See image below.`;
    await twilioClient.messages.create({
      from: `whatsapp:${twilioPhone}`,
      to: `whatsapp:${adminPhone}`,
      body: message,
      mediaUrl: [photo],
    });
    console.log("✅ WhatsApp alert sent!");
  } catch (err) {
    console.error("❌ Error sending WhatsApp alert:", err);
  }
};

module.exports = { sendWhatsAppAlert };
