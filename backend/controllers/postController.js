const mongoose = require("mongoose")
const Post = require("../models/postModel")

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

    let imageUrl = ''

    if(req.file){
      imageUrl = `/uploads/${req.file.filename}`
    }

    // If there was a file upload error (added by Multer)
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }

    const post = await Post.create({title, content, imageUrl ,user})

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

  res.status(200).json(post)
}



module.exports = {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
  
}