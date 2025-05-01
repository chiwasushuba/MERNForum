const express = require("express")
const User = require("../models/userModel")
const {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  login,
  signup,
  getUserPosts,
  followUser
} = require("../controllers/userController")
const upload = require('../utils/requireUpload');
const requireAuth = require("../middleware/requireAuth")

const router = express.Router()

// get all users
router.get('/', getUsers)

// get a single user
router.get('/:id', getUser)

// delete a user
router.delete('/:id', deleteUser)

// update a user
router.patch('/:id', upload.single("profile"),updateUser)

// login
router.post('/login', login);

// signup
router.post('/signup', signup)

// get all users posts
router.get(`/post/:id`, getUserPosts)

// follow a user 
router.get('/follow/:id', requireAuth ,followUser)


module.exports = router;
