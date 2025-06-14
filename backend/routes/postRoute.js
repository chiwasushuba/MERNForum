const express = require("express")
const Post = require("../models/postModel")
const {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
  likePost,
  dislikePost,
} = require("../controllers/postController")
const requireAuth = require("../middleware/requireAuth")
const upload = require('../utils/requireUpload');

const router = express.Router()




// get all posts
router.get('/', getPosts)

// get a single post
router.get('/:id', getPost)

// authorization to change posts
router.use(requireAuth)

// create a post
router.post('/', upload.single("image"), createPost);

// uploads a single image no text
// router.post('/upload', upload.single('image'), uploadImage);

// delete a post
router.delete('/:id', deletePost)

// update a post
router.patch('/:id', updatePost)

// like a post 
router.patch('/:id/like', likePost)

// dislike a post 
router.patch('/:id/dislike', dislikePost)

module.exports = router;
