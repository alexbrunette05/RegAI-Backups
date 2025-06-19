const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5017;

// Schema for HR Compliance
const hrComplianceSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  certificationType: String, // e.g., "OSHA 10", "Harassment Training"
  expirationDate: Date,
  lastCompleted: Date,
  reminderSent: Boolean
});

const HRCompliance = mongoose.model('HRCompliance', hrComplianceSchema);

// POST to log or update cert status
app.post('/api/hr/compliance', async (req, res) => {
  try {
    const newEntry = new HRCompliance(req.body);
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('HR Compliance Tracker Backend is running');
});

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`HR Compliance Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
