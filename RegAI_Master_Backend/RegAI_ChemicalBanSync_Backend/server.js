const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5024;

// Chemical Ban Schema
const chemicalBanSchema = new mongoose.Schema({
  chemicalName: String,
  regionCode: String, // e.g., "EU", "CA-QC", "US-CA"
  reason: String,
  industryTags: [String], // e.g., ["agriculture", "mining"]
  bannedSince: Date,
  language: String
});

const ChemicalBan = mongoose.model('ChemicalBan', chemicalBanSchema);

// POST new banned chemical
app.post('/api/chemical-bans', async (req, res) => {
  try {
    const newBan = new ChemicalBan(req.body);
    await newBan.save();
    res.status(201).json(newBan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET banned chemicals by region
app.get('/api/chemical-bans/:regionCode', async (req, res) => {
  try {
    const banned = await ChemicalBan.find({ regionCode: req.params.regionCode });
    res.status(200).json(banned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Chemical Ban Sync Backend is running');
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Chemical Ban Sync Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
