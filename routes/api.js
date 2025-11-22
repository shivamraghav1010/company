const express = require('express');
const Link = require('../models/Link');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// POST /api/links - Create a new link
router.post('/links', [
  body('originalUrl').isURL().withMessage('Invalid URL'),
  body('shortCode').optional().isLength({ min: 1, max: 20 }).matches(/^[A-Za-z0-9]{1,20}$/).withMessage('Short code must be 1-20 alphanumeric characters'),
  body('userId').isString().notEmpty().withMessage('User ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { originalUrl, shortCode, userId } = req.body;

    let code = shortCode;
    if (!code) {
      // Generate unique random 6-character code
      let attempts = 0;
      do {
        code = Math.random().toString(36).substring(2, 8);
        attempts++;
        if (attempts > 10) {
          return res.status(500).json({ error: 'Unable to generate unique code' });
        }
      } while (await Link.findOne({ shortCode: code }));
    } else {
      // Check if custom code already exists
      const existingLink = await Link.findOne({ shortCode: code });
      if (existingLink) {
        return res.status(409).json({ error: `Custom code "${code}" is already taken. Please choose a different code.` });
      }
    }

    const link = new Link({
      shortCode: code,
      originalUrl,
      userId
    });

    await link.save();
    res.status(201).json({
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      clicks: link.clicks,
      createdAt: link.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/links - List all links for a user
router.get('/links', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const links = await Link.find({ userId }).sort({ createdAt: -1 });
    res.json(links.map(link => ({
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt
    })));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/links/:code - Get stats for a specific link
router.get('/links/:code', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const link = await Link.findOne({ shortCode: req.params.code, userId });
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/links/:code - Delete link
router.delete('/links/:code', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const link = await Link.findOneAndDelete({ shortCode: req.params.code, userId });
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;