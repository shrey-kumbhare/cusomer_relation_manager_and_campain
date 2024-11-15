const mongoose = require("mongoose");
const dotenv = require("dotenv");

require("dotenv").config({ path: "../.env" });

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
});

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

process.on("SIGINT", () => {
  gracefulShutdown("app termination", () => {
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  gracefulShutdown("App termination", () => {
    process.exit(0);
  });
});

module.exports = connectDB;
