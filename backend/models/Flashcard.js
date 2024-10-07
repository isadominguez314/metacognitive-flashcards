const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  term: {type: String, required: true},
  definition: {type: String, required: true},
  importance: {type: Number, required: true, min:1, max:5},
  confidence: {type: Number, required: true, min:1, max:5}, 
  correct: {type: Boolean, required: true, default: false},
  className: String, 
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
