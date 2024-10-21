const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard'); 

// POST a new flashcard
router.post('/', async (req, res) => {
  const { term, definition, importance, confidence, correct, className } = req.body;
  const flashcard = new Flashcard({ term, definition, importance, confidence, correct, className });

  if (!term || !definition || importance == null || confidence == null || !className || correct == null) {
    return res.status(400).json({ message: 'All fields are required and must be valid.' });
  }
  
  try {
    await flashcard.save();
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET all flashcards for a class
router.get('/:className', async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ className: req.params.className });
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT request to update flashcard confidence
router.put('/:id', async (req, res) => {
  const { id } = req.params; // Get the flashcard ID from the URL
  const { confidence, correct } = req.body; 

  try {
    // Find the flashcard by ID and update it
    const updateData = {};
    if (confidence !== undefined) updateData.confidence = confidence;
    if (correct !== undefined) updateData.correct = correct;

    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      id,
      updateData, 
      { new: true, runValidators: true } 
    );

    if (!updatedFlashcard) {
      return res.status(404).json({ message: 'Flashcard not found' }); 
    } 

    res.json(updatedFlashcard); 
  } catch (error) {
    console.error('Error updating flashcard:', error);
    res.status(500).json({ message: error.message }); 
  }
});

// Update all flashcards for a class
router.put('/reset/:className', async (req, res) => {
  try {
      const result = await Flashcard.updateMany(
          { className: req.params.className },
          { $set: { confidence: 3, correct: false } }
      );
      res.json({ message: 'Flashcards reset successfully', updatedCount: result.nModified });
  } catch (error) {
      console.error('Error resetting flashcards:', error);
      res.status(500).json({ message: 'Failed to reset flashcards' });
  }
});


module.exports = router;
