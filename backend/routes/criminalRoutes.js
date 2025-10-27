const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Criminal = require('../models/Criminal');

const upload = multer({ dest: 'uploads/' });

// Add Criminal
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'Criminal_Photos',
    });

    const criminal = new Criminal({
      ...req.body,
      photo: result.secure_url,
    });

    await criminal.save();
    res.status(201).json(criminal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// View All Criminals
router.get('/', async (req, res) => {
  try {
    const criminals = await Criminal.find();
    res.json(criminals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// View Criminal Details
router.get('/:id', async (req, res) => {
  try {
    const criminal = await Criminal.findById(req.params.id);
    if (!criminal) return res.status(404).json({ message: 'Criminal not found' });
    res.json(criminal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;