const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5029;

// Message Schema
const messageSchema = new mongoose.Schema({
  organizationId: String,
  senderId: String,
  recipientId: String,
  subject: String,
  messageBody: String,
  sentAt: Date,
  read: Boolean
});

const Message = mongoose.model('Message', messageSchema);

// POST new message
app.post('/api/messages', async (req, res) => {
  try {
    const msg = new Message({ ...req.body, sentAt: new Date(), read: false });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET messages by recipient
app.get('/api/messages/recipient/:recipientId', async (req, res) => {
  try {
    const inbox = await Message.find({ recipientId: req.params.recipientId });
    res.status(200).json(inbox);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET messages by sender
app.get('/api/messages/sender/:senderId', async (req, res) => {
  try {
    const sent = await Message.find({ senderId: req.params.senderId });
    res.status(200).json(sent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Internal Messaging Backend is running');
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Messaging Backend running on port ${PORT}`));
})
.catch(err => console.error(err));
