const nodemailer = require("nodemailer");
const logger = require("./logger");

// Provider-agnostic: plain SMTP, so this works with Gmail (app password),
// Brevo, Resend (smtp.resend.com), Mailtrap, etc. — swap providers by
// changing env vars, no code change.
const isMailerConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.EMAIL_FROM);

let transporter = null;
const getTransporter = () => {
  if (transporter) return transporter;
  const port = Number(process.env.SMTP_PORT) || 587;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = implicit TLS, 587/25 = STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
};

// Resolves { sent: true } on success, { sent: false, skipped } when email
// isn't configured (never an error — email is optional), and THROWS on a
// real delivery failure so callers can decide whether to surface it.
const sendEmail = async ({ to, subject, text, html }) => {
  if (!isMailerConfigured()) {
    logger.debug("Email skipped — SMTP is not configured", { to, subject });
    return { sent: false, skipped: "not_configured" };
  }
  const info = await getTransporter().sendMail({ from: process.env.EMAIL_FROM, to, subject, text, html });
  logger.info("Email sent", { to, subject, messageId: info.messageId });
  return { sent: true, messageId: info.messageId };
};

// Test hook — lets tests/scripts rebuild the transport after changing env.
const resetTransporter = () => {
  transporter = null;
};

module.exports = { sendEmail, isMailerConfigured, resetTransporter };