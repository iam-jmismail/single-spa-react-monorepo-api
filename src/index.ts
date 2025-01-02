import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth";
import { DatabaseService } from "./lib/db";
import { config } from "dotenv";
import { errorHandler } from "./lib/error-handler";

config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(authRoutes);

// Connected to MongoDB
DatabaseService.connect();

// Ping Route
app.get("/", (req, res) => {
  res.send("Pong");
});

// Custom Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
