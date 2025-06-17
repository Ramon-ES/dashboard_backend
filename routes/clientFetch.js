import express from 'express';
import Client from '../models/Client.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// 0. Admin-only: Fetch all clients and their full data
router.get('/data', verifyToken, async (req, res) => {
  try {
    // Optional: Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    const clients = await Client.find({});
    res.json(clients);
  } catch (err) {
    console.error('Admin fetch all clients error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 1. Fetch all data by company name
router.get('/data/:companyName', verifyToken, async (req, res) => {
  const { companyName } = req.params;

  try {
    const client = await Client.findOne({ name: companyName });
    if (!client) return res.status(404).json({ message: 'Company not found' });
    res.json(client);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. Fetch data by company name & scenario name (if it exists)
router.get('/data/:companyName/:scenarioName', verifyToken, async (req, res) => {
  const { companyName, scenarioName } = req.params;

  try {
    const client = await Client.findOne(
      { name: companyName },
      { [`subjects.${scenarioName}`]: 1, _id: 0 }
    );
    if (!client || !client.subjects || !client.subjects[scenarioName]) {
      return res.status(404).json({ message: 'Scenario not found' });
    }
    res.json(client.subjects[scenarioName]);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. Fetch character data by company name & character name inside scenario (defaulting to 'characterCreator' scenario)
router.get('/data/:companyName/character/:characterName', verifyToken, async (req, res) => {
  const { companyName, characterName } = req.params;
  const scenarioName = 'characterCreator'; // hardcoded scenario, adjust if needed

  try {
    const client = await Client.findOne(
      { name: companyName },
      { [`subjects.${scenarioName}.${characterName}`]: 1, _id: 0 }
    );
    if (!client || !client.subjects || !client.subjects[scenarioName] || !client.subjects[scenarioName][characterName]) {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.json(client.subjects[scenarioName][characterName]);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
