type PostType = {
  _id: string;
  title: string;
  content: string;
  image: string;
  user : {
    _id: string
    profile: string;
    username: string;
    verified: boolean;
  };
  likes: number;
  dislikes: number;
}

export default PostType;