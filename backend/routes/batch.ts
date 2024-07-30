import express from 'express';
import { Batch } from '../mongodb/models';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const batch = new Batch(req.body);
    await batch.save();
    res.status(201).json({success: true, data: batch, message: 'Batch created successfully'});
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find();
    res.json({success: true, data: batches});
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// TODO: redirect to statistics
router.get('/:id', async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    res.json({ success: true, data: batch });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// TODO: also allow removing or adding students
router.post('/:id/edit', async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    res.json({ success: true, data: batch });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/delete', async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    res.json({ success: true, message: 'Batch deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;