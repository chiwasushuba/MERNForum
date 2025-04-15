require('dotenv').config()

const mongoose = require("mongoose")
const User = require("../models/userModel")
const jwt= require("jsonwebtoken")


const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '5d'})
}

const getUsers = async (req, res) => {
  const users = await User.find()

  try{
    res.status(200).json(users)
  }catch(error){
    res
  }
 
}

// get a single user
const getUser = async (req, res) => {

  const { id } = req.params
  
  const user = await User.findById(id)

  if(!user){
    return res.status(404).json({error: "User not found"})
  }

  res.status(200).json(user)
  
}

// login

const login = async (req, res) =>{
  const {username, password} = req.body

  try{
    const user = await User.login(username, password)

    const token = createToken(user._id)
    const loggedUser = await User.findById(user.id)
    const userId = loggedUser._id

    

    res.status(200).json({userId, username, token})
  }catch(error){
    res.status(400).json({error: error.message})
  }
}

// signup
const signup = async (req, res) => {
  const {username, password} = req.body

  try{
    const user = await User.signup(username, password)

    const token = createToken(user._id)

    res.status(200).json({username, token})
  }catch(error){
    res.status(400).json({error: error.message})
  }
}

// delete a user
const deleteUser = async (req, res) => {

  const { id } = req.params
  
  const user = await User.findOneAndDelete({_id: id})

  if(!user){
    return res.status(404).json({error: "User not found"})
  }

  res.status(200).json({mssg: "user deleted succesfully"})
}

// update a user
const updateUser = async (req, res) => {
  
  const { id } = req.params
  
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({error: "No such workout"})
  }

  const user = await User.findOneAndUpdate({_id: id},{
    ...req.body
  })

  if(!user){
    return res.status(404).json({error: "User not found"})
  }

  res.status(200).json(user)
}

module.exports = {
  getUsers,
  getUser,
  signup,
  deleteUser,
  updateUser,
  login,
}