const Message = require('../models/messageModel');

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { content, senderId, receiverId } = req.body;

    const newMessage = await Message.create({
      content,
      senderId,
      receiverId,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all messages between two users
const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

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

//

// Soft delete message
const softDeleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndUpdate(messageId, { isDeleted: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit a message

const updateMessage = async (req,res) => {
  try{
    const {messageId} = req.params;
    const {newContent} = req.body;

    const updated = await Message.findByIdAndUpdate(messageId, {content: newContent})
    res.status(200).json(updated);

  } catch (err){
    res.status(500).json({error: err.message});
  }
}

const deleteMessage = async (req,res) => {
  try{
    const {messageId} = req.params;

    const message = await Message.findByIdAndDelete(messageId);
    res.status(200).json({message: `deleted${message}`})

  } catch (err){
    res.status(500).json({error: err.message});
  }
}


module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  softDeleteMessage,
  updateMessage,
  deleteMessage,
  
}