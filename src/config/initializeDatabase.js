import mongoose from "mongoose";
import connectDB from "./db.js";
import User from "../models/UserModel.js";
import Village from "../models/VillageModel.js";
import Town from "../models/TownModel.js";
import Taluka from "../models/TalukaModel.js";
import District from "../models/DistrictModel.js";
import Division from "../models/DivisionModel.js";
import City from "../models/CityModel.js";
import School from "../models/SchoolModel.js";
import Hospital from "../models/HospitalModel.js";
import College from "../models/CollegeModel.js";
import ActivityLog from "../models/ActivityLogModel.js";
import Population from "../models/PopulationModel.js";

const initializeDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    console.log("Initializing database and collections...");

    // Import all models to ensure they are registered with Mongoose
    // This will auto-create collections when first used
    const models = [
      User,
      Village,
      Town,
      Taluka,
      District,
      Division,
      City,
      School,
      Hospital,
      College,
      ActivityLog,
      Population,
    ];

    // Create indexes for all models
    for (const model of models) {
      try {
        await model.createIndexes();
        console.log(`✓ Created indexes for ${model.modelName} collection`);
      } catch (error) {
        console.warn(
          `⚠ Warning creating indexes for ${model.modelName}:`,
          error.message,
        );
      }
    }

    console.log("✓ Database initialization completed successfully");
    console.log(`✓ Database: ${mongoose.connection.name}`);
    console.log(
      `✓ Collections created: ${models.map((m) => m.modelName).join(", ")}`,
    );
  } catch (error) {
    console.error("✗ Database initialization failed:", error.message);
    process.exit(1);
  }
};

export default initializeDatabase;
