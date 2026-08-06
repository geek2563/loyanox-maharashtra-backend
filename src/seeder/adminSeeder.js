import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/UserModel.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check and create admin user
    const existingAdmin = await User.findOne({
      email: "blackpatil@loyanox.com",
    });

    if (!existingAdmin) {
      await User.create({
        name: "Akash Patil",
        email: "blackpatil@loyanox.com",
        password: "Demo@123",
        role: "superadmin",
      });
      console.log("Admin user Created");
    } else {
      // Update role to superadmin if exists
      if (existingAdmin.role !== "superadmin") {
        existingAdmin.role = "superadmin";
        await existingAdmin.save();
        console.log("Admin user updated to superadmin");
      } else {
        console.log("Admin user already exists as superadmin");
      }
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
