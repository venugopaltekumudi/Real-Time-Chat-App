import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend in production (corrected)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../public"))); // Serve from 'public'

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html")); // Serve index.html from 'public'
  });
}

// Connect to DB before starting the server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server is running on PORT: ${PORT}`);
  });
});
