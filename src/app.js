import express from "express";
import cors from "cors";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import villageRoutes from "./routes/villageRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import divisionRoutes from "./routes/divisionRoutes.js";
import districtRoutes from "./routes/districtRoutes.js";
import activityLogRoutes from "./routes/activityLogRoutes.js";
import cityRoutes from "./routes/cityRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import talukaRoutes from "./routes/talukaRoutes.js";
import townRoutes from "./routes/townRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import populationRoutes from "./routes/populationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import workAssignmentRoutes from "./routes/workAssignmentRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

app.use(express.json());

const allowedOrigins = [
  // "http://localhost:3000",
  // "http://127.0.0.1:3000",
  // "http://localhost:3001",
  "https://loyanox-maharashtra.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("MH Nexus API Running");
});

// Mounted API Routes (Standardized to Plural Endpoints)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/divisions", divisionRoutes);
app.use("/api/v1/districts", districtRoutes);
app.use("/api/v1/talukas", talukaRoutes);
app.use("/api/v1/villages", villageRoutes);
app.use("/api/v1/cities", cityRoutes);
app.use("/api/v1/towns", townRoutes);
app.use("/api/v1/schools", schoolRoutes);
app.use("/api/v1/hospitals", hospitalRoutes);
app.use("/api/v1/colleges", collegeRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/activitylogs", activityLogRoutes);
app.use("/api/v1/populations", populationRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/work-assignments", workAssignmentRoutes);
app.use(errorMiddleware);
export default app;
