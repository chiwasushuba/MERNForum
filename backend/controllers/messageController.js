// controllers/messageController.js
const Message = require('../models/messageController');

// GET /api/message/history
const getMessageHistory = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).limit(100);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// POST /api/message
const saveMessage = async (req, res) => {
  const { text, senderId, receiverId } = req.body;

  if (!text || !senderId) {
    return res.status(400).json({ error: 'Missing text or senderId' });
  }

  try {
    const message = new Message({ text, senderId, receiverId });
    const saved = await message.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
};

module.exports = {
  getMessageHistory,
  saveMessage
};
