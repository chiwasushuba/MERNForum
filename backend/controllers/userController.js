require('dotenv').config()

const mongoose = require("mongoose")
const User = require("../models/userModel")
const jwt= require("jsonwebtoken")
const Post = require("../models/postModel")
const { bucket } = require("../utils/firebase");



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

    res.status(200).json({userId: user._id, username, token})
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
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid user ID" });
  }

  try {
    let imageUrl = "";

    // Handle image upload if file is present
    if (req.file) {
      const fileName = `${id}/${Date.now()}-${req.file.originalname}`;
      const blob = bucket.file(fileName);

      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        blobStream.on("error", (error) => reject(error));
        blobStream.on("finish", async () => {
          try {
            await blob.makePublic();
            imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve();
          } catch (err) {
            reject(err);
          }
        });

        blobStream.end(req.file.buffer);
      });
    }

    // If Multer added a file validation error
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }

    // Prepare the update object
    const updateData = {
      ...req.body,
    };

    // Only set image field if a new image was uploaded
    if (imageUrl) {
      updateData.profile = imageUrl;
    }

    // Update user
    const user = await User.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true } // <-- return the updated document
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({updatedData: updateData});

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// gets all the posts of the user
const getUserPosts = async (req ,res) => {
  const {id} = req.params

  const posts = await Post.find({ "user": id }).populate("user", "username profile"); 

  if(!posts){
    res.status(404).json("No posts posted")
  }

  res.status(200).json(posts)
}

module.exports = {
  getUsers,
  getUser,
  signup,
  deleteUser,
  updateUser,
  login,
  getUserPosts,

}