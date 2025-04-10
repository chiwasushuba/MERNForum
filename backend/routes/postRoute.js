const express = require("express")
const Post = require("../models/postModel")
const {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost
} = require("../controllers/postController")

const router = express.Router()

// get all posts
router.get('/', getPosts)

// get a single post
router.get('/:id', getPost)

// create a post
router.post('/', createPost)

// delete a post
router.delete('/:id', deletePost)

// update a post
router.patch('/:id', updatePost)

module.exports = router;
