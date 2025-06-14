const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');

// Send a message
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, content } = req.body;

    const newMessage = await Message.create({
      content,
      senderId,
      receiverId,
    });

    // Update or create the conversation
    const existingConversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingConversation) {
      existingConversation.lastMessage = content;
      existingConversation.lastMessageAt = new Date();
      await existingConversation.save();
    } else {
      await Conversation.create({
        members: [senderId, receiverId],
        lastMessage: content,
        lastMessageAt: new Date(),
      });
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
};


// Get all messages between two users
const getMessages = async (req, res) => {
  try {
    const userId1 = req.user._id;
    const userId2 = req.params.userId; // use req.params.userId instead of destructuring

    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
      isDeleted: false,
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const updated = await Message.findByIdAndUpdate(messageId, { isRead: true }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Soft delete message
const softDeleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const updated = await Message.findByIdAndUpdate(messageId, { isDeleted: true }, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit a message
const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { newContent } = req.body;

    const updated = await Message.findByIdAndUpdate(
      messageId,
      { content: newContent },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Hard delete message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: 'Message deleted successfully', data: message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  softDeleteMessage,
  updateMessage,
  deleteMessage,
};
