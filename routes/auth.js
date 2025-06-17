// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Client from "../models/Client.js";
import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";

import {DEFAULT_CHARACTER_DATA} from "../data/defaultData/characterCreator.js"
import {DEFAULT_CONVERSATION_DATA} from "../data/defaultData/conversationalContext.js"


const router = express.Router();

// router.post("/register", verifyToken, requireAdmin, async (req, res) => {
// 	const { email, password, role, company } = req.body;

// 	const existingUser = await User.findOne({ email });
// 	if (existingUser)
// 		return res.status(400).json({ error: "User already exists" });

// 	const user = new User({ email, password, role, company });
// 	await user.save();
// 	res.status(201).send("User registered");
// });

router.post('/register', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { email, password, role, company } = req.body;

    if (!email || !password || !role || !company) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Check if company exists, create if not
    let client = await Client.findOne({ name: company });
    if (!client) {
      client = new Client({
        name: company,
        subjects: {
          characterCreator: {
            default: DEFAULT_CHARACTER_DATA,
          },
          conversationalContext: {
            default: DEFAULT_CONVERSATION_DATA,
          },
        },
      });
      await client.save();
    }

    // Create and save user
    const user = new User({ email, password, role, company });
    await user.save();    

    res.status(201).json({ message: 'User registered', userId: user._id, companyId: client._id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (!user || !(await user.comparePassword(password))) {
		return res.status(401).json({ error: "Invalid credentials" });
	}

	const token = jwt.sign(
		{
			id: user._id,
			company: user.company,
			role: user.role,
		},
		process.env.JWT_SECRET,
		{ expiresIn: "1d" }
	);

  console.log(jwt.decode(token)); 
	res.json({ token });
});

// Debug route - optional
router.get("/all-users", async (req, res) => {
	try {
		const users = await User.find({});
		res.json(users);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch users" });
	}
});

export default router;
