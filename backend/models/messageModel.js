const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true, // ensures every message belongs to a conversation
    },
    content: {
      type: String,
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ✅ Indexes
messageSchema.index({ conversationId: 1, timestamp: -1 }); // fast pagination per convo
messageSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });

module.exports = mongoose.model("Message", messageSchema);
