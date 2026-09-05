const Sentry = require("@sentry/node");
const logger = require("./logger");

// No-op if SENTRY_DSN isn't set — Sentry is optional, not a hard requirement
// to run the app locally or in CI.
const initSentry = (app) => {
  if (!process.env.SENTRY_DSN) {
    logger.info("SENTRY_DSN not set — Sentry error tracking disabled");
    return { isEnabled: false };
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.2,
  });

  logger.info("Sentry error tracking enabled");
  return { isEnabled: true };
};

module.exports = { initSentry, Sentry };