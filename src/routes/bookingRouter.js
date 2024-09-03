const express = require("express");
const {
  bookSeat,
  getBookingDetails,
  getUserBookingsDetails,
} = require("../controllers/bookingController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/book", authenticate, bookSeat);
router.get("/details", authenticate, getBookingDetails);
router.get("/userBookings", authenticate, getUserBookingsDetails);

module.exports = router;
