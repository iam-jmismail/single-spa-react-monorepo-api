import mongoose from "mongoose";

import { config } from "dotenv";

config();

export class DatabaseService {
  static dbString = process.env.MONGO_URL!;

  static async connect() {
    try {
      await mongoose.connect(this.dbString);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }
}
