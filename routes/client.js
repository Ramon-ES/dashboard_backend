// routes/client.js
import express from 'express';
import Client from '../models/Client.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/save/:subject/:itemId', verifyToken, async (req, res) => {
  const { subject, itemId } = req.params;
  const { data } = req.body;

  console.log("User from token:", req.user);

  try {
    const path = `subjects.${subject}.${itemId}`;

    const result = await Client.updateOne(
      { name: req.user.company },
      { $set: { [path]: { ...data, updatedAt: new Date() } } },
      { upsert: true }
    );

    res.json({ success: true, result });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin save route - only accessible to admins
router.post('/admin/save/:company/:subject/:itemId', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { company, subject, itemId } = req.params;
  const { data } = req.body;

  try {
    const path = `subjects.${subject}.${itemId}`;
    console.log(company, subject, itemId);

    const result = await Client.updateOne(
      { name: company },
      { $set: { [path]: { ...data, updatedAt: new Date() } } },
      { upsert: true }
    );

    res.json({ success: true, result });
  } catch (err) {
    console.error('Admin save error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create a new Client (company)
router.post('/create', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { name, email, ...otherDetails } = req.body;

  try {
    const existing = await Client.findOne({ name });
    if (existing) return res.status(400).json({ error: 'Company already exists' });

    const newClient = new Client({
      name,
      email,
      ...otherDetails,
    });

    await newClient.save();

    res.status(201).json({ success: true, client: newClient });
  } catch (err) {
    console.error('Create client error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE endpoint for clients to delete their own item
router.delete('/delete/:subject/:itemId', verifyToken, async (req, res) => {
  const { subject, itemId } = req.params;

  try {
    const path = `subjects.${subject}.${itemId}`;

    const result = await Client.updateOne(
      { name: req.user.company },
      { $unset: { [path]: "" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, error: 'Item not found or not deleted' });
    }

    res.json({ success: true, result });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Admin-only DELETE endpoint to delete any company item
router.delete('/admin/delete/:company/:subject/:itemId', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { company, subject, itemId } = req.params;

  try {
    const path = `subjects.${subject}.${itemId}`;

    const result = await Client.updateOne(
      { name: company },
      { $unset: { [path]: "" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, error: 'Item not found or not deleted' });
    }

    res.json({ success: true, result });
  } catch (err) {
    console.error('Admin delete error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
