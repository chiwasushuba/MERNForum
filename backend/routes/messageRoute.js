const express = require('express');
const requireAuth = require('../middleware/requireAuth');

module.exports = (io) => {
  const router = express.Router();
  const messageController = require('../controllers/messageController')(io);

  router.use(requireAuth);

  router.post('/send', messageController.sendMessage);
  router.get('/:userId', messageController.getMessages);
  router.patch('/read/:messageId', messageController.markAsRead);
  router.patch('/delete/:messageId', messageController.softDeleteMessage);
  router.patch('/edit/:messageId', messageController.updateMessage);
  router.delete('/:messageId', messageController.deleteMessage);

  return router;
};
