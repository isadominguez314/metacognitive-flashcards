const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const flashcardRoutes = require('./routes/flashcardRoutes'); 

const app = express();

// Database Connection
mongoose.connect('mongodb://localhost:27017/FlashcardsApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors()); 
app.use(express.json()); 

// Routes
app.use('/api/flashcards', flashcardRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));