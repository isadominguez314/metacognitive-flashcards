const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const flashcardRoutes = require('./routes/flashcardRoutes'); // Path to your routes file

const app = express();

// Database Connection
mongoose.connect('mongodb://localhost:27017/FlashcardsApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Parses JSON requests

// Routes
app.use('/api/flashcards', flashcardRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 5000;
// app.use(cors());
// app.use(express.json());
// // Connect to MongoDB
// mongoose.connect('mongodb://localhost/flashcards-db', { useNewUrlParser: true, useUnifiedTopology: true });
// // Define routes and middleware
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// const flashcardSchema = new mongoose.Schema({
//     term: String, 
//     definition: String, 
//     mastered: Boolean
// });

// const Flashcard = mongoose.model('Flashcard', flashcardSchema);

// // Add this to server.js
// app.get('/flashcards', async (req, res) => {
//     const flashcards = await Flashcard.find();
//     res.json(flashcards);
//   });

// // Create a new todo
// app.post('/flashcards', async (req, res) => {
//     const newFlashcard = new Flashcard(req.body);
//     await newFlashcard.save();
//     res.json(newFlashcard);
//   });
// //   // Update an existing todo
// //   app.put('/todos/:id', async (req, res) => {
// //     const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
// //     res.json(updatedTodo);
// //   });
// //   // Delete a todo
// //   app.delete('/todos/:id', async (req, res) => {
// //     await Todo.findByIdAndRemove(req.params.id);
// //     res.json({ message: 'Todo deleted successfully' });
// //   });