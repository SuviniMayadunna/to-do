const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔹 Register new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
     if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide all fields" });
    }
    // check existing user
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err); 
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// 🔹 Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // check user
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
