const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const qrRoutes = require("./routes/qrRoutes");

dotenv.config();

const app = express();
const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(process.cwd(), "uploads");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*"
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

// Serve frontend static files
const frontendDir = path.join(process.cwd(), "..", "frontend");
app.use(express.static(frontendDir));

app.get("/api/ip", (_req, res) => {
  const os = require("os");
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return res.json({ ip: net.address });
      }
    }
  }
  return res.json({ ip: "localhost" });
});


app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "QR Utility API is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/qrs", qrRoutes);

// Catch-all: serve frontend index.html for non-API routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.use((error, _req, res, _next) => {
  if (error && error.status) {
    return res.status(error.status).json({ message: error.message });
  }
  return res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
