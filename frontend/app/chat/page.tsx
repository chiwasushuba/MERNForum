'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthContext } from '@/hooks/useAuthContext';
import axios from 'axios';

type OnlineUser = {
  userId: string;
  username: string;
};

type ChatMessage = {
  _id?: string;
  senderId: string;
  receiverId?: string;
  content: string;
  timestamp?: string;
};

export default function ChatPage() {
  const { userInfo, authIsReady } = useAuthContext();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [draftMessage, setDraftMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  const token = userInfo?.token || '';
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Setup socket connection once
  useEffect(() => {
    if (!authIsReady || !userInfo) return;

    document.title = 'Flux Talk';

    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
      transports: ['websocket'],
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to socket server');
      socketInstance.emit('join', {
        userId: userInfo.userId,
        username: userInfo.username,
      });
    });

    socketInstance.on('online_users', (users: OnlineUser[]) => {
      setOnlineUsers(users.filter((u) => u.userId !== userInfo.userId));
    });

    // ✅ Listen for messages but ignore your own to prevent duplicates
    socketInstance.on('receive_message', (data: ChatMessage) => {
      if (
        selectedUser &&
        (data.senderId === selectedUser.userId || data.receiverId === selectedUser.userId)
      ) {
        if (data.senderId !== userInfo.userId) {
          setChatMessages((prev) => [...prev, data]);
        }
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [authIsReady, userInfo, selectedUser, token]);

  const sendMessage = async () => {
    if (!draftMessage.trim() || !selectedUser || !socket || !userInfo) return;

    const messageData: ChatMessage = {
      senderId: userInfo.userId,
      receiverId: selectedUser.userId,
      content: draftMessage.trim(),
      timestamp: new Date().toISOString(), // ✅ so it renders immediately with a time
    };

    // 👀 Update UI instantly for YOUR side only
    setChatMessages((prev) => [...prev, messageData]);

    // Emit via socket
    socket.emit('send_message', messageData);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/send`,
        messageData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('❌ Error sending message:', err);
    }

    setDraftMessage('');
  };

  const openChatWithUser = async (user: OnlineUser) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/${user.userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.conversation) {
        setChatMessages(res.data.conversation); // ✅ sets history properly
        setSelectedUser(user);
      }
    } catch (err) {
      console.error('❌ Error fetching chat history:', err);
    }
  };

  return (
    <div className="p-6 flex gap-6">
      {/* Online Users Sidebar */}
      <div className="w-1/3 border-r pr-4">
        <h2 className="text-xl font-bold mb-3">🟢 Online Users</h2>
        <ul className="space-y-2">
          {onlineUsers.map((u) => (
            <li
              key={u.userId}
              className={`cursor-pointer hover:underline ${
                selectedUser?.userId === u.userId ? 'font-bold text-blue-500' : ''
              }`}
              onClick={() => openChatWithUser(u)}
            >
              {u.username}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="w-2/3">
        {selectedUser ? (
          <>
            <h2 className="text-xl font-bold mb-3">
              Chatting with <span className="text-green-600">{selectedUser.username}</span>
            </h2>
            <div className="border rounded p-3 h-[300px] overflow-y-auto bg-gray-100 mb-3">
              {chatMessages.length === 0 && (
                <p className="text-sm text-gray-500">No messages yet.</p>
              )}
              {chatMessages.map((msg, i) => (
                <div
                  key={msg._id || i}
                  className={`mb-2 ${
                    msg.senderId === userInfo?.userId ? 'text-right' : 'text-left'
                  }`}
                >
                  <span
                    className={`inline-block px-3 py-1 rounded ${
                      msg.senderId === userInfo?.userId
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300'
                    }`}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2">
              <input
                className="border rounded p-2 flex-1"
                placeholder="Type a message..."
                value={draftMessage}
                onChange={(e) => setDraftMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600">Select an online user to start chatting.</p>
        )}
      </div>
    </div>
  );
}
