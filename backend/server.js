const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const endpointRoutes = require("./routes/endpointRoutes");
// Import your other routes here

const app = express();

const exactAllowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.FRONTEND_URL,
  ]
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, ""))
);

function isAllowedVercelPreview(origin) {
  return /^https:\/\/pulse-[a-z0-9-]+-siddhants-projects-3a33f486\.vercel\.app$/i.test(
    origin
  );
}

const corsOptions = {
  origin(origin, callback) {
    // Allows Postman, PowerShell and server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, "");

    if (
      exactAllowedOrigins.has(normalizedOrigin) ||
      isAllowedVercelPreview(normalizedOrigin)
    ) {
      return callback(null, true);
    }

    console.error("CORS blocked origin:", normalizedOrigin);

    return callback(
      new Error(`Origin ${normalizedOrigin} is not allowed by CORS`)
    );
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware must be before routes
app.use(cors(corsOptions));
app.use(express.json());

// Routes must be after CORS
app.use("/api/auth", authRoutes);
app.use("/api/endpoints", endpointRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("PulseAPI Backend is running");
});

// Database initialization/API checker can remain here
// initDatabase();
// startApiChecker();

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});