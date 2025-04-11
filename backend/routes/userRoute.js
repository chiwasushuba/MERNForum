const express = require("express")
const User = require("../models/userModel")
const {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  login,
  signup
} = require("../controllers/userController")
const requireAuth = require("../middleware/requireAuth")

const router = express.Router()

router.use(requireAuth)

// get all users
router.get('/', getUsers)

// get a single user
router.get('/:id', getUser)

// delete a user
router.delete('/:id', deleteUser)

// update a user
router.patch('/:id', updateUser)

// login
router.post('/login', login);

// signup
router.post('/signup', signup)

module.exports = router;
