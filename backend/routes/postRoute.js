const express = require("express")
const Post = require("../models/postModel")
const {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,

} = require("../controllers/postController")
const requireAuth = require("../middleware/requireAuth")
const upload = require('../utils/requireUpload');
const {uploadImage} = require("../controllers/uploadController")

const router = express.Router()

// authorization to see posts
router.use(requireAuth)

// get all posts
router.get('/', getPosts)

// get a single post
router.get('/:id', getPost)

// create a post
router.post('/', upload.single("image"), createPost);

// uploads a single image no text
router.post('/upload', upload.single('image'), uploadImage);

// delete a post
router.delete('/:id', deletePost)

// update a post
router.patch('/:id', updatePost)

module.exports = router;
