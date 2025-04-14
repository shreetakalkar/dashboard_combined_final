import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

// Server configuration
const PORT = process.env.PORT || 5000;

// MongoDB connection configuration
let MONGO_URI = process.env.MONGO_URI;

// Validate and construct MongoDB URI
if (!MONGO_URI) {
  console.warn("⚠️  MONGO_URI not found in .env, using local MongoDB");
  MONGO_URI = "mongodb://localhost:27017/demobargenix";
} else {
  // Normalize URI - remove trailing slash if exists
  MONGO_URI = MONGO_URI.endsWith('/') ? 
    MONGO_URI.slice(0, -1) : 
    MONGO_URI;
  
  // Remove the database name appending logic
  // Now using the URI exactly as provided
}

// Add connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

console.log(`🔗 MongoDB Connection URI: ${MONGO_URI}`);

// Database connection function
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, mongooseOptions);
    console.log("✅ MongoDB Connected Successfully!");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

// Start the application
connectDB();