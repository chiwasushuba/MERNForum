const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');

module.exports = (io) => {
  // ======================
  // 📩 Send a message
  // ======================
  const sendMessage = async (req, res) => {
    try {
      const senderId = req.user._id;
      const { receiverId, content } = req.body;

      // Find or create the conversation
      let conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          members: [senderId, receiverId],
        });
      }

      // Save the message linked to conversation
      let newMessage = await Message.create({
        content,
        senderId,
        receiverId,
        conversationId: conversation._id,
      });

      let isDelivered = false;

      // Check if receiver is online
      const sockets = await io.in(receiverId.toString()).fetchSockets();
      if (sockets.length > 0) {
        isDelivered = true;
        await Message.findByIdAndUpdate(newMessage._id, { isDelivered: true });
        newMessage = await Message.findById(newMessage._id);
        io.to(receiverId.toString()).emit('new_message', newMessage);
      }

      // Update conversation
      conversation.lastMessage = newMessage._id;
      conversation.lastMessageAt = new Date();
      await conversation.save();

      res.status(201).json({ ...newMessage.toObject(), isDelivered });
    } catch (err) {
      console.error('Error sending message:', err);
      res.status(500).json({ success: false, message: 'Error sending message', error: err.message });
    }
  };


  // ======================
  // 📜 Get messages in a conversation
  // ======================
  const getMessages = async (req, res) => {
    try {
      const { conversationId } = req.params;

      // Pagination (?page=1&limit=20)
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const messages = await Message.find({
        conversationId,
        isDeleted: false,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        success: true,
        page,
        limit,
        count: messages.length,
        conversation: messages,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };


  // ======================
  // ✅ Mark message as read
  // ======================
  const markAsRead = async (req, res) => {
    try {
      const { messageId } = req.params;
      const updated = await Message.findByIdAndUpdate(
        messageId,
        { isRead: true },
        { new: true }
      );

      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };


  // ======================
  // 🗑️ Soft delete message
  // ======================
  const softDeleteMessage = async (req, res) => {
    try {
      const { messageId } = req.params;
      const updated = await Message.findByIdAndUpdate(
        messageId,
        { isDeleted: true },
        { new: true }
      );

      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };


  // ======================
  // ✏️ Edit a message
  // ======================
  const updateMessage = async (req, res) => {
    try {
      const { messageId } = req.params;
      const { newContent } = req.body;

      if (!newContent) {
        return res.status(400).json({ success: false, message: 'newContent is required' });
      }

      const updated = await Message.findByIdAndUpdate(
        messageId,
        { content: newContent },
        { new: true }
      );

      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };


  // ======================
  // ❌ Hard delete message
  // ======================
  const deleteMessage = async (req, res) => {
    try {
      const { messageId } = req.params;
      const message = await Message.findByIdAndDelete(messageId);

      res.status(200).json({ success: true, message: 'Message deleted successfully', data: message });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };


  // ======================
  // 🗑️ Hard delete entire conversation
  // ======================
  const deleteConversation = async (req, res) => {
    try {
      const { conversationId } = req.params;

      // Delete all messages in the conversation
      const result = await Message.deleteMany({ conversationId });

      // Delete the conversation itself
      await Conversation.findByIdAndDelete(conversationId);

      res.status(200).json({
        success: true,
        deletedCount: result.deletedCount,
        message: "Conversation and all messages deleted permanently",
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };


  return {
    sendMessage,
    getMessages,
    markAsRead,
    softDeleteMessage,
    updateMessage,
    deleteMessage,
    deleteConversation,
  };
};
