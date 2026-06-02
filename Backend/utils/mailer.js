let nodemailer;
try {
  nodemailer = require("nodemailer");
} catch (err) {
  console.log("nodemailer not pre-installed. Using fallback mock console mailer.");
}

// SMTP Transporter configuration
// Can be customized via environment variables
const createTransporter = () => {
  if (nodemailer && process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

// Generic mail sender
const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"BarberPro Concierge" <noreply@barberpro.com>',
    to,
    subject,
    text: text || "This is a premium automated message from BarberPro.",
    html,
  };

  const transporter = createTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email Sent] MessageID: ${info.messageId} to ${to}`);
      return true;
    } catch (err) {
      console.error(`[Email Error] Failed to send email to ${to}:`, err.message);
    }
  }

  // Fallback beautiful console logging
  console.log(`
========================================================================
[AUTOMATED EMAIL LOG] (SMTP offline / fallback simulation)
------------------------------------------------------------------------
From: ${mailOptions.from}
To: ${to}
Subject: ${subject}
Text: ${mailOptions.text}
HTML Preview:
${html.substring(0, 400)}... [truncated]
========================================================================
  `);
  return true;
};

// --- EMAIL TEMPLATES ---

// 1. Welcome Email
exports.sendWelcomeEmail = async (user) => {
  const subject = "Welcome to BarberPro! Let's get you styled.";
  const dashboardUrl = "http://localhost:5173/customerprofile";
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EADBCE; border-radius: 16px; background-color: #FFFDF9;">
      <h2 style="color: #3D3126; font-family: Georgia, serif;">Welcome to BarberPro, ${user.name}!</h2>
      <p style="color: #5C5248; font-size: 14px; line-height: 1.6;">Your premium account has been created successfully. Welcome to a grooming experience tailored for the modern gentleman.</p>
      
      <div style="background-color: #FAF6F0; border-radius: 12px; padding: 15px; margin: 20px 0; border: 1px solid #EADBCE;">
        <h4 style="margin: 0; color: #B58B67; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Getting Started</h4>
        <p style="margin: 5px 0 0 0; color: #3D3126; font-size: 13px;">You can view upcoming reservations, track loyalty stamps, configure notification cadences, and manage dependents in your brand-new, empty dashboard hub.</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}" style="background-color: #B58B67; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">Go to Dashboard</a>
      </div>

      <p style="color: #8A7A6A; font-size: 11px; text-align: center; border-top: 1px solid #EADBCE; padding-top: 15px; margin-top: 30px;">
        BarberPro Systems • Premium Grooming Automation SaaS • Engineered by Graphura India
      </p>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html, text: `Welcome to BarberPro, ${user.name}! Access your new dashboard here: ${dashboardUrl}` });
};

// 2. New Service Announcement
exports.sendNewServiceEmail = async (user, service) => {
  const subject = "New Service Added at BarberPro Menu!";
  const bookingUrl = "http://localhost:5173/customer/booking";

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EADBCE; border-radius: 16px; background-color: #FFFDF9;">
      <h2 style="color: #3D3126; font-family: Georgia, serif;">Hey ${user.name}, we've added something special!</h2>
      <p style="color: #5C5248; font-size: 14px; line-height: 1.6;">We are thrilled to announce a brand-new addition to our premium styling services catalog, designed to elevate your routine.</p>
      
      <div style="background-color: #FAF6F0; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #EADBCE; text-align: center;">
        <span style="background-color: #B58B67; color: white; font-size: 9px; font-weight: bold; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">New Launch</span>
        <h3 style="color: #3D3126; margin: 10px 0 5px 0; font-family: Georgia, serif; font-size: 18px;">${service.name}</h3>
        <p style="color: #8A7A6A; font-size: 12px; margin: 0 0 10px 0;">${service.description || "Indulge in our latest luxury service."}</p>
        <span style="font-size: 16px; font-weight: bold; color: #3D3126;">₹${service.price}</span>
      </div>

      <p style="color: #5C5248; font-size: 13px; line-height: 1.6; text-align: center;">We just added ${service.name} to our menu! Book now to be among the first to experience it.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${bookingUrl}" style="background-color: #B58B67; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">Book Now</a>
      </div>

      <p style="color: #8A7A6A; font-size: 11px; text-align: center; border-top: 1px solid #EADBCE; padding-top: 15px; margin-top: 30px;">
        You received this because you opted-in to receive "New Service Added" updates. You can manage preferences in your dashboard.
      </p>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html, text: `We just added ${service.name} to our menu! Book now: ${bookingUrl}` });
};

// 3. Review Confirmation
exports.sendReviewConfirmationEmail = async (user, review) => {
  const subject = "Thank you for your feedback! Review Confirmed";

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EADBCE; border-radius: 16px; background-color: #FFFDF9;">
      <h2 style="color: #3D3126; font-family: Georgia, serif;">Thank you, ${user.name}!</h2>
      <p style="color: #5C5248; font-size: 14px; line-height: 1.6;">We have successfully received your feedback. Reviews help our barber stylists maintain the highest standard of grooming precision.</p>
      
      <div style="background-color: #FAF6F0; border-radius: 12px; padding: 15px; margin: 20px 0; border: 1px solid #EADBCE;">
        <p style="margin: 0; color: #3D3126; font-size: 13px; font-style: italic;">"${review.review_text || "Loved the cut! Clean and precise."}"</p>
        <p style="margin: 5px 0 0 0; color: #B58B67; font-size: 11px; font-weight: bold; text-transform: uppercase;">
          Rating: ${review.barber_rating || 5} Stars • Barber: ${review.barberName || "Barber Stylist"}
        </p>
      </div>

      <p style="color: #5C5248; font-size: 13px; line-height: 1.6;">Your loyalty stamp balance has been verified and updated. We look forward to seeing you for your next scheduled fade.</p>

      <p style="color: #8A7A6A; font-size: 11px; text-align: center; border-top: 1px solid #EADBCE; padding-top: 15px; margin-top: 30px;">
        BarberPro Systems • Premium Grooming Automation SaaS • Engineered by Graphura India
      </p>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html, text: `Thank you for your feedback, ${user.name}! Rating of ${review.barber_rating || 5} stars confirmed.` });
};

// 4. One-Month Reminder
exports.sendOneMonthReminderEmail = async (user, lastBarberName) => {
  const subject = "Hey! It's been a month since your last haircut.";
  const bookingUrl = "http://localhost:5173/customer/booking";

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EADBCE; border-radius: 16px; background-color: #FFFDF9;">
      <h2 style="color: #3D3126; font-family: Georgia, serif;">Hey ${user.name}, it's been a month!</h2>
      <p style="color: #5C5248; font-size: 14px; line-height: 1.6;">We noticed it has been 30 days since your last premium grooming session with us. Your hair misses us and a fresh look makes all the difference.</p>
      
      <div style="background-color: #FAF6F0; border-radius: 12px; padding: 15px; margin: 20px 0; border: 1px solid #EADBCE; text-align: center;">
        <p style="margin: 0; color: #3D3126; font-size: 13px; font-weight: bold;">"Your hair misses us. Rebook your usual session today."</p>
        <p style="margin: 5px 0 0 0; color: #B58B67; font-size: 11px; font-weight: bold; text-transform: uppercase;">
          Last Barber: ${lastBarberName || "Barber Ajay"}
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${bookingUrl}" style="background-color: #B58B67; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">Rebook Your Usual</a>
      </div>

      <p style="color: #8A7A6A; font-size: 11px; text-align: center; border-top: 1px solid #EADBCE; padding-top: 15px; margin-top: 30px;">
        You received this monthly cadence reminder because you opted-in on your dashboard.
      </p>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html, text: `Hey ${user.name}, it's been a month! Click here to rebook your usual with ${lastBarberName || "Barber"}: ${bookingUrl}` });
};

// 5. Newsletter Broadcast
exports.sendNewsletterBroadcast = async (user, newsletterContent) => {
  const subject = newsletterContent.subject || "BarberPro Weekly Newsletter";
  const dashboardUrl = "http://localhost:5173/customerprofile";

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #EADBCE; border-radius: 16px; background-color: #FFFDF9;">
      <h2 style="color: #3D3126; font-family: Georgia, serif; text-align: center;">BarberPro Weekly</h2>
      <p style="color: #8A7A6A; font-size: 11px; text-align: center; text-transform: uppercase; letter-spacing: 1px; margin-top: -10px; margin-bottom: 25px;">Grooming Trends & Studio News</p>
      
      <p style="color: #5C5248; font-size: 14px; line-height: 1.6;">Hello ${user.name},</p>
      <div style="color: #3D3126; font-size: 14px; line-height: 1.6; border-left: 3px solid #B58B67; padding-left: 15px; margin: 20px 0;">
        ${newsletterContent.body || "Find the latest style insights and discount schedules on your central dashboard portal."}
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}" style="background-color: #B58B67; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">Visit Studio Portal</a>
      </div>

      <p style="color: #8A7A6A; font-size: 11px; text-align: center; border-top: 1px solid #EADBCE; padding-top: 15px; margin-top: 30px;">
        To unsubscribe from this weekly digest, please update your notification preferences inside your central user settings panel.
      </p>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html, text: `${subject} - Access your portal: ${dashboardUrl}` });
};
