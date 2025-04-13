const mongoose = require("mongoose")
const Post = require("../models/postModel")

const getPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  try{
    res.status(200).json(posts)
  }catch(error){
    res
  }
 
}

// get a single post
const getPost = async (req, res) => {

  const { id } = req.params
  
  const post = await Post.findById(id)

  if(!post){
    return res.status(404).json({error: "post not found"})
  }

  res.status(200).json(post)
  
}

// create a post
const createPost = async (req, res) => {
  const {title, content} = req.body

  try{
    const post = await Post.create({title, content})
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
  updatePost
}