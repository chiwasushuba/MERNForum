'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
interface Follow {
    _id: string;
    username: string
}
interface FollowersDivProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  followedBy: Follow[]; // expecting list of usernames or similar strings
}

const FollowersDiv = ({ setIsOpen, followedBy }: FollowersDivProps) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <Card className="w-1/5 min-h-[40%] max-h-[80%] p-6 overflow-y-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl">Followers</CardTitle>
                <CardDescription>People following this user</CardDescription>
              </div>
              <Button
                variant="destructive"
                onClick={() => setIsOpen(false)}
              >
                <X size={32} strokeWidth={2.5} />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="mt-4">
            {(followedBy && followedBy.length > 0) ? (
              <ul className="space-y-2 list-disc list-inside">
                {followedBy.map((follower, idx) => (
                  <li key={idx} className="text-lg">{follower.username}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No followers found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default FollowersDiv;
