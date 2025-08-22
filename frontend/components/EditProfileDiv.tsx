import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { ImageIcon, X } from "lucide-react";
import { motion } from "framer-motion";
import { Label } from "@radix-ui/react-label";

interface ErrorResponse {
  message: string;
  status: number;
}
interface AddPostDivProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditProfileButton({ setIsOpen }: AddPostDivProps) {
  const [newUsername, setNewUsername] = useState<string>("");
  const [newBio, setNewBio] = useState<string>("");
  const userData = localStorage.getItem("userInfo");
  const userId = userData ? JSON.parse(userData).userId : null;
  const token = userData ? JSON.parse(userData).token : null;
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [openImageBtn, setIsOpenImageBtn] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleEdit = async (
    newUsername: string,
    newBio: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId || !token) {
      alert("You are not logged in.");
      return;
    }

    const formData = new FormData();
    if (newUsername.trim()) formData.append("username", newUsername);
    if (newBio.trim()) formData.append("bio", newBio);
    if (newImage) formData.append("profile", newImage);

    if (
      !formData.has("username") &&
      !formData.has("bio") &&
      !formData.has("profile")
    ) {
      alert("No changes made.");
      return;
    }

    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        alert("Successfully updated profile");
      } else {
        alert(`Unexpected status: ${res.status}`);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response && axiosError.response.status === 409) {
        alert("Username already exists. Please choose a different one.");
      } else {
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  const removeImage = () => {
    setNewImage(null);
    setImagePreview("");
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <Card className="w-3/5 min-h-[60%] max-h-[80%] p-6 overflow-y-auto">
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>Edit Profile</CardTitle>
            <Button variant={"destructive"} onClick={() => setIsOpen(false)}>
              <X size={48} strokeWidth={3} />
            </Button>
          </CardHeader>
          <CardContent>
            <div>
              Username:
              <input
                type="text"
                className="w-full h-11 mb-1 rounded-md border p-2"
                placeholder="johnDoe"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>

            <div>
              Bio:
              <textarea
                className="w-full h-40 mb-3 rounded-md border p-2"
                placeholder="Write something..."
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              {!openImageBtn ? (
                <Button
                  type="button"
                  onClick={() => setIsOpenImageBtn(true)}
                  className="flex items-center gap-2"
                >
                  <ImageIcon size={16} />
                  Add Image
                </Button>
              ) : (
                <div className="space-y-2">
                  <Label>Upload Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="w-full hover:border-4"
                    onChange={handleImageChange}
                  />

                  {imagePreview && (
                    <div className="relative mt-2">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-[200px] rounded-md object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  )}

                  {!imagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpenImageBtn(false)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              )}
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
                  await handleEdit(newUsername, newBio, e);
                  setIsOpen(false);
                  window.location.reload();
                }}
                className="rounded-md bg-primary text-primary-foreground px-4 py-2"
              >
                Edit
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
