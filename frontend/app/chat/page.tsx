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

  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [conversationExists, setConversationExists] = useState<boolean>(false);

  const [chatCache, setChatCache] = useState<
    Record<string, { messages: ChatMessage[]; cursor: string | null; hasMore: boolean; exists: boolean }>
  >({});

  const token = userInfo?.token || '';
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessages.length && !loadingMore) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, loadingMore]);

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

    socketInstance.on('receive_message', (data: ChatMessage) => {
      if (
        selectedUser &&
        (data.senderId === selectedUser.userId || data.receiverId === selectedUser.userId)
      ) {
        setChatMessages((prev) => {
          if (prev.some((msg) => msg._id === data._id)) return prev;
          return [...prev, data];
        });
        setConversationExists(true);
        setChatCache((prev) => ({
          ...prev,
          [selectedUser.userId]: {
            ...(prev[selectedUser.userId] || { cursor: null, hasMore: true }),
            exists: true,
            messages: [...(prev[selectedUser.userId]?.messages || []), data],
          },
        }));
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
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, messageData]);
    setConversationExists(true);

    setChatCache((prev) => ({
      ...prev,
      [selectedUser.userId]: {
        ...(prev[selectedUser.userId] || { cursor: null, hasMore: true }),
        exists: true,
        messages: [...(prev[selectedUser.userId]?.messages || []), messageData],
      },
    }));

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
    setSelectedUser(user);

    if (chatCache[user.userId]) {
      setChatMessages(chatCache[user.userId].messages);
      setCursor(chatCache[user.userId].cursor);
      setHasMore(chatCache[user.userId].hasMore);
      setConversationExists(chatCache[user.userId].exists);
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/${user.userId}?limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const messages = res.data.messages || [];
      const nextCursor = res.data.nextCursor || null;
      const exists = !!res.data.conversation;

      setChatMessages(messages);
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
      setConversationExists(exists);

      setChatCache((prev) => ({
        ...prev,
        [user.userId]: { messages, cursor: nextCursor, hasMore: !!nextCursor, exists },
      }));
    } catch (err) {
      console.error('❌ Error loading messages:', err);
    }
  };

  const loadOlderMessages = async () => {
    if (!selectedUser || !cursor || loadingMore) return;
    setLoadingMore(true);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/${selectedUser.userId}?limit=20&cursor=${cursor}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const olderMessages = res.data.messages || [];
      const nextCursor = res.data.nextCursor || null;

      setChatMessages((prev) => [...olderMessages, ...prev]);
      setCursor(nextCursor);
      setHasMore(!!nextCursor);

      setChatCache((prev) => ({
        ...prev,
        [selectedUser.userId]: {
          ...(prev[selectedUser.userId] || { exists: true }),
          messages: [...olderMessages, ...(prev[selectedUser.userId]?.messages || [])],
          cursor: nextCursor,
          hasMore: !!nextCursor,
          exists: true,
        },
      }));
    } catch (err) {
      console.error('❌ Error loading older messages:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="flex h-screen">
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

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 bg-gray-100 font-semibold border-b">
              Chat with {selectedUser.username}
            </div>
            <div
              className="flex-1 overflow-y-auto p-4 space-y-2"
              ref={chatBoxRef}
              onScroll={(e) => {
                if ((e.target as HTMLDivElement).scrollTop === 0 && hasMore && !loadingMore) {
                  loadOlderMessages();
                }
              }}
            >
              {loadingMore && <p className="text-center text-sm">Loading...</p>}
              {!conversationExists && (
                <p className="text-center text-gray-500 text-sm">No messages yet. Say hello 👋</p>
              )}
              {chatMessages.map((msg) => (
                <div
                  key={msg._id || msg.timestamp}
                  className={`p-2 rounded ${
                    msg.senderId === userInfo?.userId
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
