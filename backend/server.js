const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const endpointRoutes = require("./routes/endpointRoutes");

const initDatabase = require("./config/initDb");

// Supports either:
// module.exports = startApiChecker
// or:
// module.exports = { startApiChecker }
const apiCheckerModule = require("./services/apiChecker");
const startApiChecker =
  typeof apiCheckerModule === "function"
    ? apiCheckerModule
    : apiCheckerModule.startApiChecker;

const app = express();

/* =========================================================
   CORS CONFIGURATION
========================================================= */

const exactAllowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://localhost:4173",

    // Stable Vercel production domain
    "https://pulse-api-six.vercel.app",

    // Railway environment variable
    process.env.FRONTEND_URL,
  ]
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, ""))
);

function isAllowedVercelPreview(origin) {
  try {
    const parsedUrl = new URL(origin);
    const hostname = parsedUrl.hostname;

    if (parsedUrl.protocol !== "https:") {
      return false;
    }

    // Example:
    // pulse-7qje02nu7-siddhants-projects-3a33f486.vercel.app
    const teamPreviewPattern =
      /^pulse-[a-z0-9-]+-siddhants-projects-3a33f486\.vercel\.app$/i;

    // Allows aliases such as:
    // pulse-api-six.vercel.app
    // pulse-api-abc123.vercel.app
    const projectAliasPattern =
      /^pulse-api-[a-z0-9-]+\.vercel\.app$/i;

    return (
      teamPreviewPattern.test(hostname) ||
      projectAliasPattern.test(hostname)
    );
  } catch {
    return false;
  }
}

const corsOptions = {
  origin(origin, callback) {
    // Requests from PowerShell, Postman, cron jobs and servers
    // may not contain an Origin header.
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, "");

    const isAllowed =
      exactAllowedOrigins.has(normalizedOrigin) ||
      isAllowedVercelPreview(normalizedOrigin);

    if (isAllowed) {
      console.log("CORS allowed:", normalizedOrigin);
      return callback(null, true);
    }

    console.error("CORS blocked:", normalizedOrigin);

    // Do not crash the server for a blocked origin.
    return callback(null, false);
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: true,
  optionsSuccessStatus: 204,
};

/* =========================================================
   MIDDLEWARE
========================================================= */

// CORS must be placed before every route.
app.use(cors(corsOptions));

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

/* =========================================================
   HEALTH ROUTES
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    message: "PulseAPI Backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "PulseAPI Backend",
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   API ROUTES
========================================================= */

app.use("/api/auth", authRoutes);
app.use("/api/endpoints", endpointRoutes);

// Add your other existing routes here.
// Example:
//
// const incidentRoutes = require("./routes/incidentRoutes");
// app.use("/api/incidents", incidentRoutes);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    method: req.method,
    path: req.originalUrl,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((error, req, res, next) => {
  console.error("Unhandled server error:", {
    message: error.message,
    stack: error.stack,
  });

  res.status(error.status || 500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : undefined,
  });
});

/* =========================================================
   SERVER STARTUP
========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    "Allowed exact CORS origins:",
    Array.from(exactAllowedOrigins)
  );

  try {
    await Promise.resolve(initDatabase());
    console.log("Database initialization completed");

    if (typeof startApiChecker === "function") {
      startApiChecker();
      console.log("API checker started");
    } else {
      console.warn(
        "API checker was not started because startApiChecker was not exported correctly"
      );
    }
  } catch (error) {
    console.error("Startup initialization failed:", {
      message: error.message,
      stack: error.stack,
    });
  }
});