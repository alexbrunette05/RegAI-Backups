const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5030;

// Disclaimer Schema
const disclaimerSchema = new mongoose.Schema({
  version: String,
  content: String,
  language: String,
  dateCreated: Date
});

// Acceptance Schema
const acceptanceSchema = new mongoose.Schema({
  userId: String,
  organizationId: String,
  disclaimerVersion: String,
  acceptedAt: Date,
  language: String
});

const Disclaimer = mongoose.model('Disclaimer', disclaimerSchema);
const Acceptance = mongoose.model('Acceptance', acceptanceSchema);

// POST a new disclaimer version
app.post('/api/disclaimers', async (req, res) => {
  try {
    const newDisclaimer = new Disclaimer({ ...req.body, dateCreated: new Date() });
    await newDisclaimer.save();
    res.status(201).json(newDisclaimer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST acceptance log
app.post('/api/acceptance', async (req, res) => {
  try {
    const acceptance = new Acceptance({ ...req.body, acceptedAt: new Date() });
    await acceptance.save();
    res.status(201).json(acceptance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET latest disclaimer by language
app.get('/api/disclaimers/:language', async (req, res) => {
  try {
    const latest = await Disclaimer.findOne({ language: req.params.language }).sort({ dateCreated: -1 });
    res.status(200).json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('AI Disclaimer Manager Backend is running');
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Disclaimer Manager Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
