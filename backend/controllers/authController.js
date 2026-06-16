const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Registration failed",
          error,
        });
      }

      const token = jwt.sign(
        {
          id: result.insertId,
          email: email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: result.insertId,
          name: name,
          email: email,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (error, results) => {
    if (error) {
      return res.status(500).json({
        message: "Login failed",
        error,
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = results[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
};