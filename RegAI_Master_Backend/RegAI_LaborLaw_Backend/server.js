const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5016;

// Schema for Labor Law Poster Access
const posterAccessSchema = new mongoose.Schema({
  organizationId: String,
  userId: String,
  posterType: String, // e.g. "federal", "state", "local"
  region: String, // e.g. "California", "Quebec"
  language: String,
  accessDate: Date,
  accessedVia: String, // "email", "SMS", "web"
  confirmed: Boolean
});

const PosterAccess = mongoose.model('PosterAccess', posterAccessSchema);

// POST route to log access
app.post('/api/posters/access', async (req, res) => {
  try {
    const newAccess = new PosterAccess({ ...req.body, accessDate: new Date() });
    await newAccess.save();
    res.status(201).json(newAccess);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Labor Law Poster Backend is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Labor Law Poster Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
