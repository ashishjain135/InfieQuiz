// backend/src/utility/dbConnect.js
import mongoose from "mongoose";

const connectToDatabase = async (uri) => {
  try {
    const conn = await mongoose.connect(uri, {
      // options not required for mongoose v6+
    });
    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("🔴 MongoDB connection error:", error.message || error);
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});

export default connectToDatabase;
