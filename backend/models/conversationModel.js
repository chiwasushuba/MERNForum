const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    isGroup: { type: Boolean, default: false },
    groupName: { type: String },
    groupAvatar: { type: String },

    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    lastMessageAt: { type: Date, default: Date.now },

    unreadCounts: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Helpful indexes
conversationSchema.index({ members: 1 });
conversationSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model("Conversation", conversationSchema);
