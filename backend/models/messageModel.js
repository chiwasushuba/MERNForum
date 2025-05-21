const mongoose = require("mongoose")

const Schema = mongoose.Schema

const messageSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  receiverId: {
    type: String // Optional, if you want private chat
  },
  timestamp: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model('Message', messageSchema);