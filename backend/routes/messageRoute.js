// routes/messageRoute.js
const express = require('express');
const router = express.Router();
const {
  getMessageHistory,
  saveMessage
} = require('../controllers/messageController');

router.get('/history', getMessageHistory); 
router.post('/', saveMessage);             

module.exports = router;
