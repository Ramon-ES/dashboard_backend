const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Admin-only signup
exports.signup = async (req, res) => {
  try {
    const { email, password, role, company } = req.body;

    // Only allow admins to create users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create users." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      company: role === "client" ? company : null,
    });

    res.status(201).json({ message: "User created", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// Login for all users
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        company: user.company || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user._id, email: user.email, role: user.role, company: user.company } });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
