const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const path = require('path');

// Load environment variables
dotenv.config();

const targetEmail = process.argv[2];

if (!targetEmail || !targetEmail.includes('@')) {
  console.error('\n❌ Error: Please provide a valid email address as an argument.');
  console.error('Usage: node send_test_email.js your-email@example.com\n');
  process.exit(1);
}

console.log(`\n⏳ Attempting to send a real-time test email to: ${targetEmail}...`);

// Create SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Beautiful Premium Gold/Cream HTML Template
const htmlContent = `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #EADBCE; border-radius: 24px; background-color: #FFFDF9; box-shadow: 0 10px 30px rgba(44, 36, 30, 0.05);">
    <div style="text-align: center; margin-bottom: 25px;">
      <span style="font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #2C241E; text-transform: uppercase;">BARBER <span style="color: #C5A059;">PRO</span></span>
      <div style="width: 40px; height: 1.5px; background: #C5A059; margin: 12px auto 0;"></div>
    </div>
    
    <h2 style="color: #2C241E; font-size: 20px; font-weight: 700; text-align: center; margin-top: 0;">SMTP Connection Verified!</h2>
    <p style="color: #5C5248; font-size: 14px; line-height: 1.6; text-align: center;">This is a live transactional test email confirming that your application's SMTP server is successfully integrated with your professional Google App Credentials.</p>
    
    <div style="background-color: #FAF6F0; border-radius: 16px; padding: 20px; margin: 25px 0; border: 1px solid #EADBCE; text-align: center;">
      <span style="background-color: #C5A059; color: white; font-size: 9px; font-weight: bold; padding: 4px 10px; border-radius: 5px; text-transform: uppercase; letter-spacing: 1.5px; display: inline-block; margin-bottom: 12px;">Active Status</span>
      <p style="margin: 0; color: #2C241E; font-size: 14px; font-weight: 700;">Host: <span style="font-weight: 400; color: #5C5248;">${process.env.SMTP_HOST}</span></p>
      <p style="margin: 6px 0 0 0; color: #2C241E; font-size: 14px; font-weight: 700;">Sender User: <span style="font-weight: 400; color: #5C5248;">${process.env.SMTP_USER}</span></p>
    </div>

    <p style="color: #8A7A6A; font-size: 11px; text-align: center; border-top: 1px solid #EADBCE; padding-top: 20px; margin-top: 30px; letter-spacing: 0.5px;">
      BarberPro Systems • Premium Grooming Automation SaaS • Engineered by Graphura India
    </p>
  </div>
`;

const mailOptions = {
  from: process.env.SMTP_FROM || '"BarberPro" <noreply@barberpro.com>',
  to: targetEmail,
  subject: '✦ BarberPro SMTP Integration Live Verification ✦',
  html: htmlContent,
  text: `BarberPro SMTP Connection Verified successfully for ${targetEmail}.`,
};

// Send mail
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('\n❌ SMTP Send Mail Error:', error.message);
    process.exit(1);
  } else {
    console.log('\n✅ Email sent successfully!');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log('Check your email inbox to view the result.\n');
    process.exit(0);
  }
});
