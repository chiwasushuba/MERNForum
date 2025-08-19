type ChatMessageType = {
  senderId: string;
  receiverId?: string;
  content: string;
  timestamp: string;
};

export default ChatMessageType;