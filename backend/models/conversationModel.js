const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for quick querying
conversationSchema.index({ members: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
