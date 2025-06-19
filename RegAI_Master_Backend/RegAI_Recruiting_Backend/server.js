const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5022;

// Applicant Schema
const applicantSchema = new mongoose.Schema({
  organizationId: String,
  jobTitle: String,
  name: String,
  email: String,
  phone: String,
  resumeUrl: String,
  stage: String, // e.g. "applied", "interviewed", "hired", "rejected"
  notes: String,
  dateApplied: Date
});

const Applicant = mongoose.model('Applicant', applicantSchema);

// POST new applicant
app.post('/api/applicants', async (req, res) => {
  try {
    const newApplicant = new Applicant({ ...req.body, dateApplied: new Date() });
    await newApplicant.save();
    res.status(201).json(newApplicant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all applicants by org
app.get('/api/applicants/:orgId', async (req, res) => {
  try {
    const applicants = await Applicant.find({ organizationId: req.params.orgId });
    res.status(200).json(applicants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Recruiting Backend is running');
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Recruiting Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
