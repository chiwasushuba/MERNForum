import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import axios from 'axios';

interface EditPostEventProps {
  postId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function EditPostEvent({ postId, isOpen, setIsOpen }: EditPostEventProps) {
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newVideo, setNewVideo] = useState('');
    const [newPhoto, setNewPhoto] = useState('');
    const [newTags, setNewTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    const [showVideoInput, setShowVideoInput] = useState(false)
    const [showPhotoInput, setShowPhotoInput] = useState(false)

    const handleEditPost = async (title: string, content: string, video: string, photo: string, tags: string[], e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("Editing post:", { postId, title, content, tags, token }); 

        const body: { title: string, content: string, video?: string, photo?: string ,tags?: string[] } = {
            title,
            content
        };
    
        if (tags && tags.length > 0) {
            body.tags = tags;
        }

        if (video) {
            body.video = video;
        }

        if (photo) {
            body.photo = photo;
        }

        try {   
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`, body, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            if (!newTags.includes(tagInput.trim())) {
                setNewTags([...newTags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        const updatedTags = newTags.filter(tag => tag !== tagToRemove);
        setNewTags(updatedTags);
    };

    // If isOpen is false, render nothing
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-[600px] bg-card">
              <CardHeader>
                  <CardTitle>Edit Post</CardTitle>
              </CardHeader>
              <CardContent>

                    {/* TITLE AND CONTENT */}
                    <textarea
                        className="w-full h-11 mb-1 rounded-md border p-2"
                        placeholder="Title..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <textarea
                        className="w-full h-40 mb-3 rounded-md border p-2"
                        placeholder="Write something..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                    />

                    {/* PHOTO AND VIDEO */}
                    <button 
                        onClick={() => setShowVideoInput((prev) => !prev)} 
                        className="rounded-md bg-secondary text-secondary-foreground mb-3 mr-4 px-4 py-2"
                    >
                        Add Video
                    </button>

                    <button 
                        onClick={() => setShowPhotoInput((prev) => !prev)} 
                        className="rounded-md bg-secondary text-secondary-foreground px-4 py-2"
                    >
                        Add Photo
                    </button>

                    {showVideoInput && (
                        <textarea
                        className="w-full h-11 mb-1 rounded-md border p-2"
                        placeholder="Video URL..."
                        value={newVideo}
                        onChange={(e) => setNewVideo(e.target.value)}
                        />
                    )}

                    {showPhotoInput && (
                        <textarea
                        className="w-full h-11 mb-1 rounded-md border p-2"
                        placeholder="Photo URL..."
                        value={newPhoto}
                        onChange={(e) => setNewPhoto(e.target.value)}
                        />
                    )}

                    {/* TAGS */}
                    <div>
                        <input
                            type='text'
                            className="w-full h-11 rounded-md border p-2"
                            placeholder="Press enter to add a tag (music, movies)"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {newTags.map((tag, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-1 bg-accent text-accent-foreground rounded-full flex items-center"
                                >
                                    {tag}
                                    <span
                                        onClick={() => removeTag(tag)}
                                        className="ml-2 cursor-pointer text-sm text-primary hover:text-gray-600"
                                    >
                                        &#x2715;
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                  <div className="flex gap-4">
                      <button
                          className="rounded-md bg-secondary text-secondary-foreground px-4 py-2"
                          onClick={() => setIsOpen(false)}
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={async (e) => { 
                              await handleEditPost(newTitle, newContent, newVideo, newPhoto, newTags, e);
                              setIsOpen(false);
                              window.location.reload();
                              console.log("it should close");
                          }} 
                          className="rounded-md bg-primary text-primary-foreground px-4 py-2"
                      >
                          Edit
                      </button>
                  </div>
              </CardFooter>
          </Card>
      </div>
    );
}