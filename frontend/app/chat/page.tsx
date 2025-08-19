'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthContext } from '@/hooks/useAuthContext';
import ChatMessageType from '@/types/chatMessageType';
import OnlineUserType from '@/types/onlineUserType';
import { House } from 'lucide-react';
import Link from 'next/link';


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
    <div className="flex justify-around h-screen bg-gray-50">
      {/* Online Users */}
      <div className="w-1/4 bg-white border-r p-4 overflow-y-auto">
        <div className='flex gap-5 mb-4'>
          <Link href={'/'}>
            <House size={32}/>
          </Link>
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Online Users</h2>
        </div>
        {onlineUsers.map((user) => (
          <button
            key={user.userId}
            className={`flex items-center gap-3 w-full text-left p-2 mb-2 rounded-lg 
              hover:bg-blue-100 transition ${
                selectedUser?.userId === user.userId ? "bg-blue-200" : ""
              }`}
            onClick={() => openChatWithUser(user)}
          >
            {/* Avatar (first letter of username) */}
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-800">{user.username}</span>
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white font-semibold border-b flex items-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 font-semibold">
                {selectedUser.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-800">Chat with {selectedUser.username}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-xs p-3 rounded-2xl shadow-sm ${
                    msg.senderId === userInfo.userId
                      ? "bg-blue-500 text-white ml-auto rounded-br-none"
                      : "bg-white text-gray-800 mr-auto rounded-bl-none border"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white flex gap-2">
              <input
                type="text"
                value={draftMessage}
                onChange={(e) => setDraftMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full transition"
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
