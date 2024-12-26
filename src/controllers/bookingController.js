const dbConPromise = require("../config/db");

exports.bookSeat = async (req, res) => {
  const { trainId } = req.body;
  const { userId } = req.user;

  try {
    // Start a transaction
    const connection = await dbConPromise.getConnection();
    await connection.beginTransaction();

    // Fetch available seats and version
    const [trainRows] = await connection.execute(
      "SELECT available_seats, version FROM trains WHERE id = ? FOR UPDATE",
      [trainId]
    );

    const train = trainRows[0];
    if (!train || train.available_seats < 1) {
      await connection.release();
      return res.status(400).json({ message: "No available seats" });
    }

    // Update train seats and version using optimistic locking
    const [updateResult] = await connection.execute(
      "UPDATE trains SET available_seats = ?, version = ? WHERE id = ? AND version = ?",
      [train.available_seats - 1, train.version + 1, trainId, train.version]
    );

    if (updateResult.affectedRows === 0) {
      await connection.release();
      return res.status(400).json({ message: "No available seats" });
    }

    // Insert booking record
    const [bookingResult] = await connection.execute(
      "INSERT INTO bookings (user_id, train_id) VALUES (?, ?)",
      [userId, trainId]
    );

    // Commit the transaction
    await connection.commit();
    await connection.release();

    res.status(201).json({
      message: "Booking successful",
      bookingId: bookingResult.insertId,
    });
  } catch (error) {
    console.error(error);
    await connection.rollback();
    await connection.release();
    res.status(500).json({ message: "Failed to book seat" });
  }
};

exports.getUserBookingsDetails = async (req, res) => {
  const { userId } = req.user;

  try {
    const [rows] = await dbConPromise.execute(
      "SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC",
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

exports.getBookingDetails = async (req, res) => {
  const { bookingId } = req.query;

  try {
    const [rows] = await dbConPromise.execute(
      "SELECT * FROM bookings WHERE id = ?",
      [bookingId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while fetching booking details" });
  }
};
