const mongoose = require("mongoose")
const Post = require("../models/postModel")
const { bucket } = require("../utils/firebase");

const getPosts = async (req, res) => {
  const posts = await Post.find().populate("user", "username profile").sort({ createdAt: -1 }); // Populate usernames for all posts
  try{
    res.status(200).json(posts)
  }catch(error){
    res.status(404).json(error)
  }
 
}

// get a single post
const getPost = async (req, res) => {

  const { id } = req.params
  
  const post = await Post.findById(id).populate("user", "username profile");  // Populate usernames for that specific post you will need this later in getting the posts in profile

  if(!post){
    return res.status(404).json({error: "post not found"})
  }

  res.status(200).json(post)

}

// create a post
const createPost = async (req, res) => {
  const {title, content } = req.body

  try{
    const user = req.user
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: No user found' });
    }

    let image = ''

    if(req.file){
      const fileName = `${user._id}/${Date.now()}-${req.file.originalname}`;
      const blob = bucket.file(fileName);

      const blobStream = blob.createWriteStream({
        metadata:{
          contentType: req.file.mimetype,
        },
      })

      await new Promise((resolve, reject) => {
        blobStream.on("error", (error) => reject(error));
        blobStream.on("finish", async () => {
          try {
            await blob.makePublic(); // ✅ Make the file public after it's uploaded
      
            // Generate public URL
            image = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve();
          } catch (err) {
            reject(err); // If makePublic fails
          }
        });
      
        blobStream.end(req.file.buffer);
      });
    }

    // If there was a file upload error (added by Multer)
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }

    const post = await Post.create({title, content, image ,user})

    res.status(200).json(post)
  }catch(error){
    res.status(400).json({error: error.message})
  }
}

// delete a post
const deletePost = async (req, res) => {

  const { id } = req.params
  
  const post = await Post.findOneAndDelete({_id: id})

  if(!post){
    return res.status(404).json({error: "post not found"})
  }

  res.status(200).json({mssg: "post deleted succesfully"})
}

// update a post
const updatePost = async (req, res) => {
  
  const { id } = req.params
  
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({error: "No such Post"})
  }

  const post = await Post.findOneAndUpdate({_id: id},{
    ...req.body
  })

  if(!post){
    return res.status(404).json({error: "Post not found"})
  }

  res.status(200).json({message: "Post Updated"})
}

const likePost = async (req, res) => {
  try {
      const { id } = req.params;
      const userId = req.user._id;

      // Find the post by its ID
      const post = await Post.findById(id);
      if (!post) {
          return res.status(404).json({ message: "Post not found" });
      }

      // Check if the user has already liked or disliked
      const hasLiked = post.likedBy.includes(userId);
      const hasDisliked = post.dislikedBy.includes(userId);

      if (hasLiked) {
          // Remove the like
          post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
          post.likes--; // Decrease the like count
      } else {
          // If the user has disliked, remove the dislike first
          if (hasDisliked) {
              post.dislikedBy = post.dislikedBy.filter(id => id.toString() !== userId.toString());
              post.dislikes--; // Decrease the dislike count
          }

          // Add the like
          post.likedBy.push(userId);
          post.likes++; // Increase the like count
      }

      // Save the updated post
      await post.save();

      // Respond with the updated post
      return res.json({
          message: "Like status updated",
          likes: post.likes,
          dislikes: post.dislikes
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while updating the like status" });
  }
};




const dislikePost = async (req, res) => {
  try {
      const { id } = req.params;
      const userId = req.user._id;

      const post = await Post.findById(id);
      if (!post) {
          return res.status(404).json({ message: "Post not found" });
      }

      const hasDisliked = post.dislikedBy.includes(userId);
      const hasLiked = post.likedBy.includes(userId);

      if (hasDisliked) {
          post.dislikedBy = post.dislikedBy.filter(id => id.toString() !== userId.toString());
          post.dislikes--;
      } else {
          if (hasLiked) {
              post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
              post.likes--; 
          }

          post.dislikedBy.push(userId);
          post.dislikes++; 
      }

      await post.save();

      return res.json({
          message: "Dislike status updated",
          likes: post.likes,
          dislikes: post.dislikes
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while updating the dislike status" });
  }
};




module.exports = {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
  likePost,
  dislikePost
}