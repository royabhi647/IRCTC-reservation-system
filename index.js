const express = require("express");
require("./src/config/db");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const userRouter = require("./src/routes/userRouter");
const trainRouter = require("./src/routes/trainRouter");
const bookingRouter = require("./src/routes/bookingRouter");

// middlewares
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/users", userRouter);
app.use("/trains", trainRouter);
app.use("/bookings", bookingRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
