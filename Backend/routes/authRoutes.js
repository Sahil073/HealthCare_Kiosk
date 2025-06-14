const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Admin = require("../models/model.admin"); 

// Register Route for Users
router.post("/register", async (req, res) => {
  const { fullName, cardNumber, phone, dob, password } = req.body;

  try {
    const existingUser = await User.findOne({ cardNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ fullName, cardNumber, phone, dob, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Shared Login Route for Admin and User
router.post("/login", async (req, res) => {
  const { cardNumber, password } = req.body;

  try {
    // First check if it's an admin (admin uses `username` as cardNumber)
    const admin = await Admin.findOne({ username: cardNumber });
    if (admin && admin.password === password) {
      return res.status(200).json({ message: "Admin login successful", role: "admin" });
    }

    // Then check if it's a regular user
    const user = await User.findOne({ cardNumber });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ message: "User login successful", role: "user", user });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
