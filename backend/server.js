const express = require("express");
const cors = require("cors");
const initDatabase = require("./config/initDb");
require("dotenv").config();

const authRoutes = require("./routes/authrRoutes");
const endpointRoutes = require("./routes/endpointRoutes");
const { startApiChecker } = require("./services/apiChecker");
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pulse-api-six.vercel.app/"
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/endpoints", endpointRoutes);

app.get("/", (req, res) => {
  res.send("PulseAPI Backend is running");
});

initDatabase();
//startApiChecker();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});