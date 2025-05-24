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

router.post('/send', sendMessage);
router.get('/history/:userId1/:userId2', getMessages);
router.patch('/read/:messageId', markAsRead);
router.delete('/:messageId', softDeleteMessage);
router.patch('/:messageId', updateMessage);
router.delete('/:messageId', deleteMessage);

module.exports = router;
