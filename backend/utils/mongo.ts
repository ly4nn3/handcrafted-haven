import mongoose from "mongoose";
import { config } from "@backend/config/env.config";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Cache connection in global scope
let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with connection caching
 * Optimized for serverless environments
 */
export async function connectToDB(): Promise<typeof mongoose> {
  // Return existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if none exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(config.MONGO_URI, opts)
      .then((mongoose) => {
        console.log("🔥 MongoDB Connected Successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        cached.promise = null; // Reset promise on error
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // Reset on failure
    throw err;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB
 * Useful for testing and cleanup
 */
export async function disconnectFromDB(): Promise<void> {
  if (cached.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log("📴 MongoDB Disconnected");
  }
}
