const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5028;

// Quiz Schema
const quizSchema = new mongoose.Schema({
  organizationId: String,
  moduleTitle: String,
  questions: [
    {
      question: String,
      type: String, // "multiple-choice", "true-false"
      choices: [String],
      correctAnswer: String
    }
  ],
  createdAt: Date
});

const Quiz = mongoose.model('Quiz', quizSchema);

// POST a new quiz
app.post('/api/quizzes', async (req, res) => {
  try {
    const quiz = new Quiz({ ...req.body, createdAt: new Date() });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all quizzes by org
app.get('/api/quizzes/:orgId', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ organizationId: req.params.orgId });
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Quiz LMS Backend is running');
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Quiz LMS Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
