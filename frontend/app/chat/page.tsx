'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type OnlineUser = {
  userId: string;
  username: string;
};

export default function OnlineUsersPage() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [userInfo, setUserInfo] = useState<OnlineUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!userInfo) return;

    const socketInstance = io('http://localhost:4000');

    socketInstance.on('connect', () => {
      socketInstance.emit('join', userInfo);
    });

    socketInstance.on('online_users', (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [userInfo]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🟢 Online Users</h2>
      <ul>
        {onlineUsers.map((user) => (
          <li key={user.userId}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}
