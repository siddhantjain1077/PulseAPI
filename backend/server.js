const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authrRoutes");
const endpointRoutes = require("./routes/endpointRoutes");
const { startApiChecker } = require("./services/apiChecker");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/endpoints", endpointRoutes);

app.get("/", (req, res) => {
  res.send("PulseAPI Backend is running");
});

startApiChecker();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});