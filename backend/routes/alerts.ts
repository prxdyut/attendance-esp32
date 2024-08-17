// routes/alerts.ts

import express from 'express';
import { Alert } from '../mongodb/models';

const router = express.Router();

// Create a new alert
router.post('/', async (req, res) => {
  try {
    const alert = new Alert({...req.body, all: Boolean(req.body.all)});
    await alert.save();
    res.json({ success: true, data: alert });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }).populate('batchIds').populate('userIds');
    res.json({ success: true, data: alerts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete an alert
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Alert.findByIdAndDelete(id);
    res.json({ success: true, message: 'Alert deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;