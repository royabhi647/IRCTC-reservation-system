const bcrypt = require("bcryptjs");
const dbConPromise = require("../config/db");

// user registration
exports.registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  if (role === "admin" && !isRequestAuthorized(req)) {
    return res.status(403).send("Unauthorized: Missing or invalid API key");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 8);

    const [rows] = await dbConPromise.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role]
    );

    res
      .status(201)
      .send({ message: "User registered successfully", userId: rows.insertId });
  } catch (error) {
    res.status(500).send(error);
  }
};

// user login
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await dbConPromise.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return res.status(401).send({ message: "Invalid username or password" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.send({ token });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

function isRequestAuthorized(req) {
  const { apiKey } = req.query;
  const expectedApiKey = process.env.ADMIN_API_KEY;

  if (!apiKey || apiKey !== expectedApiKey) {
    return false;
  }
  return true;
}
