'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthContext } from '@/hooks/useAuthContext';

type OnlineUser = {
  userId: string;
  username: string;
};

type Message = {
  senderId: string;
  content: string;
};

export default function ChatPage() {
  const { userInfo, authIsReady } = useAuthContext();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (!authIsReady || !userInfo) return;

    const socketInstance = io('http://localhost:4000');
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      socketInstance.emit('join', userInfo);
    });

    socketInstance.on('online_users', (users: OnlineUser[]) => {
      // Filter out self
      const others = users.filter((u) => u.userId !== userInfo._id);
      setOnlineUsers(others);
    });

    socketInstance.on('receive_message', (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [authIsReady, userInfo]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser || !socket) return;

    const messageData = {
      senderId: userInfo._id,
      receiverId: selectedUser.userId,
      content: newMessage,
    };

    socket.emit('send_message', messageData);
    setMessages((prev) => [...prev, { senderId: userInfo._id, content: newMessage }]);
    setNewMessage('');
  };

  if (!authIsReady) return <p>Loading...</p>;

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
              onClick={() => {
                setSelectedUser(u);
                setMessages([]); // reset messages on new selection
              }}
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
              {messages.length === 0 && (
                <p className="text-sm text-gray-500">No messages yet.</p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-2 ${
                    msg.senderId === userInfo._id ? 'text-right' : 'text-left'
                  }`}
                >
                  <span
                    className={`inline-block px-3 py-1 rounded ${
                      msg.senderId === userInfo._id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300'
                    }`}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="border rounded p-2 flex-1"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
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
