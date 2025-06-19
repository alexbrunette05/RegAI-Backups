const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5021;

// Job Template Schema
const jobTemplateSchema = new mongoose.Schema({
  organizationId: String,
  jobTitle: String,
  department: String,
  responsibilities: [String],
  qualifications: [String],
  language: String,
  isGlobalTemplate: Boolean
});

const JobTemplate = mongoose.model('JobTemplate', jobTemplateSchema);

// Create or update a job template
app.post('/api/job-templates', async (req, res) => {
  try {
    const template = new JobTemplate(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch job templates
app.get('/api/job-templates/:orgId', async (req, res) => {
  try {
    const templates = await JobTemplate.find({ organizationId: req.params.orgId });
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Job Templates Backend is running');
});

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Job Templates Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
