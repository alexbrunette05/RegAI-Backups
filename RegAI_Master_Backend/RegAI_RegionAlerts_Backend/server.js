const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5020;

// Region-Based Alert Schema
const regionAlertSchema = new mongoose.Schema({
  regionCode: String, // e.g., "EU-DE", "SA-BR", "US-CA"
  industry: String,
  alertType: String, // "recall", "ban", "emergency"
  message: String,
  language: String,
  scheduledAt: Date,
  sent: Boolean
});

const RegionAlert = mongoose.model('RegionAlert', regionAlertSchema);

// POST a new scheduled alert
app.post('/api/region-alerts', async (req, res) => {
  try {
    const newAlert = new RegionAlert(req.body);
    await newAlert.save();
    res.status(201).json(newAlert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET alerts for a region
app.get('/api/region-alerts/:regionCode', async (req, res) => {
  try {
    const alerts = await RegionAlert.find({ regionCode: req.params.regionCode });
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Region-Based Alert Scheduler is running');
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Region Alerts Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
