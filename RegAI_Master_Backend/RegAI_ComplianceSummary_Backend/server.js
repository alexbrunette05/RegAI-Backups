const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5018;

// Compliance Summary Schema
const summarySchema = new mongoose.Schema({
  orgId: String,
  generatedAt: Date,
  type: String, // "weekly" or "on-demand"
  summaryData: mongoose.Schema.Types.Mixed, // flexible field
  generatedBy: String
});

const ComplianceSummary = mongoose.model('ComplianceSummary', summarySchema);

// Route to create a new summary
app.post('/api/summaries', async (req, res) => {
  try {
    const newSummary = new ComplianceSummary({
      ...req.body,
      generatedAt: new Date()
    });
    await newSummary.save();
    res.status(201).json(newSummary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to fetch all summaries
app.get('/api/summaries', async (req, res) => {
  try {
    const summaries = await ComplianceSummary.find().sort({ generatedAt: -1 });
    res.status(200).json(summaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Compliance Summary Backend is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Compliance Summary Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
