const express = require("express");
const {
  addTrain,
  getSeatAvailability,
} = require("../controllers/trainController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// route for Admin adding a new train
router.post("/add", authenticate, authorize(["admin"]), addTrain);

// Get seat availability between stations
router.get("/availability", authenticate, getSeatAvailability);

module.exports = router;
