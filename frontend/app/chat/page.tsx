'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthContext } from '@/hooks/useAuthContext';
import ChatMessageType from '@/types/chatMessageType';
import OnlineUserType from '@/types/onlineUserType';


export default function ChatPage() {
  const { userInfo, authIsReady } = useAuthContext();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUserType | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const [draftMessage, setDraftMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // connect to socket.io server
  useEffect(() => {
    if (!authIsReady || !userInfo) return;

    const s = io('http://localhost:4000', {
      transports: ['websocket'],
    });

    setSocket(s);

    s.on('connect', () => {
      console.log('connected to socket', s.id);

      // join room with userId
      s.emit('join', {
        userId: userInfo.userId,
        username: userInfo.username,
      });
    });

    s.on('online_users', (users: OnlineUserType[]) => {
      setOnlineUsers(users.filter(u => u.userId !== userInfo.userId));
    });

    s.on('receive_message', (msg: ChatMessageType) => {
      setChatMessages(prev => [...prev, msg]);
    });

    return () => {
      s.disconnect();
    };
  }, [authIsReady, userInfo]);

  // scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const openChatWithUser = (user: OnlineUserType) => {
    setSelectedUser(user);
    setChatMessages([]); // reset since no DB history
  };

  const sendMessage = () => {
    if (!socket || !draftMessage.trim() || !selectedUser) return;

    const msg: ChatMessageType = {
      senderId: userInfo.userId,
      receiverId: selectedUser.userId,
      content: draftMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    socket.emit('send_message', msg);
    setChatMessages(prev => [...prev, msg]);
    setDraftMessage('');
  };

  return (
    <div className="flex h-screen">
      {/* Left: Online users */}
      <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-2">Online Users</h2>
        {onlineUsers.map((user) => (
          <button
            key={user.userId}
            className="block w-full text-left p-2 hover:bg-gray-300 rounded"
            onClick={() => openChatWithUser(user)}
          >
            {user.username}
          </button>
        ))}
      </div>

      {/* Right: Chat box */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 bg-gray-100 font-semibold border-b">
              Chat with {selectedUser.username}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded ${
                    msg.senderId === userInfo.userId
                      ? 'bg-blue-500 text-white ml-auto'
                      : 'bg-gray-300'
                  } w-fit`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t flex">
              <input
                type="text"
                value={draftMessage}
                onChange={(e) => setDraftMessage(e.target.value)}
                className="flex-1 border rounded px-2 py-1"
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-blue-500 text-white px-4 py-1 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
