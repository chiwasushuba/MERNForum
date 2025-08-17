const express = require('express');
const requireAuth = require('../middleware/requireAuth');

module.exports = (io) => {
  const router = express.Router();
  const chatController = require('../controllers/chatController')(io);

  router.use(requireAuth);

  router.post('/send', chatController.sendMessage);
  router.get('/:userId', chatController.getMessages);
  router.patch('/read/:messageId', chatController.markAsRead);
  router.patch('/delete/:messageId', chatController.softDeleteMessage);
  router.patch('/edit/:messageId', chatController.updateMessage);
  router.delete('/:messageId', chatController.deleteMessage);

  return router;
};
