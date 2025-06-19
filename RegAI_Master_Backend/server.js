const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5015;

// Incident Report Schema
const incidentSchema = new mongoose.Schema({
  type: String, // e.g., "spill", "injury", "fire"
  description: String,
  location: String,
  date: Date,
  reportedBy: String,
  resolved: Boolean
});

// Emergency Drill Schema
const drillSchema = new mongoose.Schema({
  drillType: String, // e.g., "fire", "chemical", "earthquake"
  location: String,
  date: Date,
  participants: [String],
  notes: String
});

const Incident = mongoose.model('Incident', incidentSchema);
const Drill = mongoose.model('Drill', drillSchema);

// Routes
app.post('/api/incidents', async (req, res) => {
  try {
    const newIncident = new Incident(req.body);
    await newIncident.save();
    res.status(201).json(newIncident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/drills', async (req, res) => {
  try {
    const newDrill = new Drill(req.body);
    await newDrill.save();
    res.status(201).json(newDrill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Incident Reports + Emergency Drills Backend is running');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Incident Reports Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
