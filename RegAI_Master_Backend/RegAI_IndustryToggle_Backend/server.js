const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5019;

// Schema for Industry Toggle + Language Detection
const userPreferencesSchema = new mongoose.Schema({
  userId: String,
  organizationId: String,
  selectedIndustry: String, // e.g., "Trucking", "Food Service", "Aerospace"
  preferredLanguage: String, // e.g., "en", "es", "fr", "zh"
  region: String, // e.g., "US-CA", "QC", "EU-DE"
  autoDetectedLanguage: String
});

const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);

// POST to set or update preferences
app.post('/api/preferences', async (req, res) => {
  try {
    const { userId } = req.body;
    const updated = await UserPreferences.findOneAndUpdate(
      { userId },
      req.body,
      { upsert: true, new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET preferences for a user
app.get('/api/preferences/:userId', async (req, res) => {
  try {
    const prefs = await UserPreferences.findOne({ userId: req.params.userId });
    res.status(200).json(prefs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Industry Toggle + Language Detection Backend is running');
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Industry Toggle Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
