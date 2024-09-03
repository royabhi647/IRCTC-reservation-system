const dbConPromise = require("../config/db");

// Add train
exports.addTrain = async (req, res) => {
  try {
    const { trainNumber, source, destination, totalSeats } = req.body;

    if (!trainNumber || !source || !destination || totalSeats === undefined) {
      return res.status(400).send({
        message:
          "Please provide trainNumber, source, destination, and totalSeats",
      });
    }

    const [result] = await dbConPromise.query(
      "INSERT INTO trains (train_number, source, destination, total_seats, available_seats, version) VALUES (?, ?, ?, ?, ?, ?)",
      [trainNumber, source, destination, totalSeats, totalSeats, 0]
    );

    res.status(201).send({
      message: "Train added successfully",
      trainId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding train:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// get available seats
exports.getSeatAvailability = async (req, res) => {
  try {
    const { source, destination } = req.body;

    if (!source || !destination) {
      return res
        .status(400)
        .send({ message: "Source and destination are required" });
    }

    const [rows] = await db.query(
      "SELECT id, name, available_seats " +
        "FROM trains " +
        "WHERE source = ? AND destination = ?",
      [source, destination]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .send({ message: "No trains found for the specified route" });
    }

    res.json({ trains: rows });
  } catch (error) {
    console.error("Error getting seat availability:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
