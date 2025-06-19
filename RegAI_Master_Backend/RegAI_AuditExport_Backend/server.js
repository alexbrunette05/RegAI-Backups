const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5027;

// Audit Export Schema
const exportSchema = new mongoose.Schema({
  organizationId: String,
  exportType: String, // e.g., "DOT", "OSHA", "FDA"
  format: String, // "PDF", "CSV", "JSON"
  requestedBy: String,
  requestedAt: Date,
  downloadUrl: String
});

const AuditExport = mongoose.model('AuditExport', exportSchema);

// POST a new export request
app.post('/api/exports', async (req, res) => {
  try {
    const exportRecord = new AuditExport({ ...req.body, requestedAt: new Date() });
    await exportRecord.save();
    res.status(201).json(exportRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET export history for an org
app.get('/api/exports/:orgId', async (req, res) => {
  try {
    const exports = await AuditExport.find({ organizationId: req.params.orgId });
    res.status(200).json(exports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Audit Export Backend is running');
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Audit Export Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
