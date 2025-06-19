const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5026;

// Custom Form Schema
const formSchema = new mongoose.Schema({
  organizationId: String,
  formName: String,
  description: String,
  fields: [
    {
      label: String,
      type: String, // "text", "number", "dropdown", "date", etc.
      required: Boolean,
      options: [String] // for dropdowns
    }
  ],
  createdAt: Date
});

const CustomForm = mongoose.model('CustomForm', formSchema);

// POST a new custom form
app.post('/api/forms', async (req, res) => {
  try {
    const form = new CustomForm({ ...req.body, createdAt: new Date() });
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all forms for an org
app.get('/api/forms/:orgId', async (req, res) => {
  try {
    const forms = await CustomForm.find({ organizationId: req.params.orgId });
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Custom Form Builder Backend is running');
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Form Builder Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
