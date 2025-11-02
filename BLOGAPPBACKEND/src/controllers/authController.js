const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../configs/config");

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validate required fields and return which are missing to help the client
    const missing = [];
    if (!username) missing.push("username");
    if (!email) missing.push("email");
    if (!password) missing.push("password");
    if (missing.length > 0) {
      return res
        .status(400)
        .json({ error: "Missing required field(s)", missing });
    }

    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Exclude password from response
    const { password: _pw, ...safeUser } = user.toObject();
    res
      .status(201)
      .json({ message: "User registered successfully", user: safeUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// controller functions for login

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Ensure JWT secret is configured to avoid throwing inside jwt.sign
    if (!config.JWT_SECRET) {
      console.error(
        "JWT_SECRET is not configured. Set JWT_SECRET in your environment."
      );
      return res
        .status(500)
        .json({ error: "Server configuration error: missing JWT_SECRET" });
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRATION || "1d",
    });

    // Exclude password before sending back user data
    const { password: _, ...safeUser } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      token,
      user: safeUser, // optional, sends user data without password
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// controller functions to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// controller functions to delete a user by ID (optional enhancement) --- IGNORE ---
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
// export the controller functions
module.exports = { register, login, getAllUsers, deleteUser };
