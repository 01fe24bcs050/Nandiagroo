const express = require('express');
const router = express.Router();
const Query = require('../models/Query');
const { protect, admin } = require('../middleware/auth');
const {
  sendAdminQueryNotificationEmail,
  sendQueryConfirmationEmail,
  sendQueryReplyEmail,
} = require('../utils/emailService');

// Submit query (public)
router.post('/', async (req, res) => {
  try {
    const query = await Query.create({
      ...req.body,
      email: req.body.email?.toLowerCase().trim(),
    });

    await Promise.all([
      sendQueryConfirmationEmail(query.email, query.name, query.query),
      sendAdminQueryNotificationEmail(query),
    ]);

    res.status(201).json(query);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get logged-in user's queries by account email
router.get('/my', protect, async (req, res) => {
  try {
    const queries = await Query.find({
      email: req.user.email.toLowerCase(),
    }).sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all queries (admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reply to query (admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    if (req.body.reply) {
      await sendQueryReplyEmail(query.email, query);
    }

    res.json(query);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete query (admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Query.findByIdAndDelete(req.params.id);
    res.json({ message: 'Query deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
