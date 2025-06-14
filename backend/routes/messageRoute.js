const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markAsRead,
  softDeleteMessage,
  updateMessage,
  deleteMessage,
} = require('../controllers/messageController');
const requireAuth = require("../middleware/requireAuth")

router.post('/send', requireAuth , sendMessage);
router.get('/history/:userId', requireAuth , getMessages);
router.patch('/read/:messageId', requireAuth ,markAsRead);
router.delete('/:messageId', requireAuth , softDeleteMessage);
router.patch('/:messageId', updateMessage);
router.delete('/:messageId', deleteMessage);

module.exports = router;
