import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      {
        maxPoolSize: 30,
        minPoolSize: 5,
        serverSelectionTimeoutMS: 10000,
      }
    );
    console.log(`\n MongoDB connected !! DB NAME: ${DB_NAME}`);
  } catch (err) {
    console.log("MONGODB connection FAILED ", err);
    process.exit(1);
  }
};

export default connectDB;
