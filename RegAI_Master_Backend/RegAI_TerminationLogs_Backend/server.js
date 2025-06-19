const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5023;

// Termination Log Schema
const terminationSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  position: String,
  organizationId: String,
  terminationDate: Date,
  reason: String,
  exitInterviewNotes: String,
  documentsUrl: String // link to signed termination docs if applicable
});

const TerminationLog = mongoose.model('TerminationLog', terminationSchema);

// Log a termination
app.post('/api/terminations', async (req, res) => {
  try {
    const log = new TerminationLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch terminations by org
app.get('/api/terminations/:orgId', async (req, res) => {
  try {
    const records = await TerminationLog.find({ organizationId: req.params.orgId });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Termination Logs Backend is running');
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Termination Logs Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
