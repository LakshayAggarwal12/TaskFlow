const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Database connection failed", { message: error.message });
    process.exit(1); // stop the app if DB connection fails
  }
};

module.exports = connectDB;