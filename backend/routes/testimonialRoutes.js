const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { protect, admin } = require('../middleware/auth');

// Get all testimonials (public)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit testimonial (logged-in users only)
router.post('/', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.create({
      name: req.user.name,
      email: req.user.email,
      rating: req.body.rating,
      comment: req.body.comment || req.body.message,
      status: req.body.status || 'approved',
    });
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all testimonials (admin)
router.get('/all', protect, admin, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update testimonial status (admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete testimonial (admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
