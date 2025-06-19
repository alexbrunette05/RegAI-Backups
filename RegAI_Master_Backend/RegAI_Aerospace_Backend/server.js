const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5025;

// Aerospace Launch Compliance Schema
const launchComplianceSchema = new mongoose.Schema({
  missionName: String,
  launchDate: Date,
  launchProvider: String, // e.g., "NASA", "SpaceX", "ESA"
  location: String,
  approved: Boolean,
  materialsApproved: [String], // e.g., ["Carbon Fiber A32", "Lithium Battery Type X"]
  complianceDocsUrl: String,
  regulatoryAgencies: [String] // e.g., ["FAA", "ITAR", "CSA"]
});

const LaunchCompliance = mongoose.model('LaunchCompliance', launchComplianceSchema);

// POST a new launch compliance record
app.post('/api/launches', async (req, res) => {
  try {
    const newLaunch = new LaunchCompliance(req.body);
    await newLaunch.save();
    res.status(201).json(newLaunch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all launch records
app.get('/api/launches', async (req, res) => {
  try {
    const launches = await LaunchCompliance.find().sort({ launchDate: -1 });
    res.status(200).json(launches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Aerospace Compliance Backend is running');
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Aerospace Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
