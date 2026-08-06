import dotenv from "dotenv";
import app from "./app.js";
import initializeDatabase from "./config/initializeDatabase.js";

dotenv.config();

initializeDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
