const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error(error);
    process.exit(1); // stop the app if DB connection fails
  }
};

module.exports = connectDB;
