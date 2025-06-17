// routes/formData.js
import express from 'express';
import jwt from 'jsonwebtoken';
import FormData from '../models/FormData.js';

const router = express.Router();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user; // { id, role, company }
    next();
  });
}

// Save or update form data for current user & formType
router.post('/save', authenticateToken, async (req, res) => {
  const { formType, data } = req.body;
  if (!formType || !data) {
    return res.status(400).json({ error: 'Missing formType or data' });
  }
  console.log("User from token:", req.user); // Should contain company


  try {
    const filter = { userId: req.user.id, formType };
    const update = {
      company: req.user.company,
      data,
      updatedAt: new Date(),
    };

    const saved = await FormData.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true, // create if not exists
    });

    res.json({ message: 'Saved successfully', saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

export default router;
