const User = require('../models/User');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  try {
    const { fullName, cardNumber, phone, dob, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ cardNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Card number already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({
      fullName,
      cardNumber,
      phone,
      dob,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'Patient registered successfully' });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

module.exports = { registerUser };
