const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addEndpoint,
  getEndpoints,
  deleteEndpoint,
  bulkImportEndpoints,
  getPublicStatus,
  getIncidents,
  checkEndpointNow,
  getEndpointById,
  getEndpointLogs,
} = require("../controllers/endpointController");

router.get("/public-status/:userId", getPublicStatus);

router.get("/incidents", protect, getIncidents);

router.post("/bulk-import", protect, bulkImportEndpoints);

router.post("/:id/check-now", protect, checkEndpointNow);

router.get("/:id/logs", protect, getEndpointLogs);

router.get("/:id", protect, getEndpointById);

router.post("/", protect, addEndpoint);

router.get("/", protect, getEndpoints);

router.delete("/:id", protect, deleteEndpoint);

module.exports = router;