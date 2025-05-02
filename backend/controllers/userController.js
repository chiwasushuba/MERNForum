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
  const users = await User.find().populate("followingUsers", "username").populate("followedBy", "username");

  try{
    res.status(200).json(users)
  }catch(error){
    res
  }
 
}

// get a single user
const getUser = async (req, res) => {

  const { id } = req.params
  
  const user = await User.findById(id).populate("followingUsers", "username").populate("followedBy", "username");

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
    const verified = loggedUser.verified

    res.status(200).json({userId, username, token, verified})
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

const followUser = async (req, res) => {
  try {
    const { id } = req.params; // ID of the user being followed
    const userId = req.user._id; // ID of the logged-in user

    // Find the users
    const followingUser = await User.findById(id); // User to be followed
    const loggedUser = await User.findById(userId); // Logged-in user

    // Ensure both users exist
    if (!followingUser) {
      return res.status(404).json({ message: "User to follow not found" });
    }
    if (!loggedUser) {
      return res.status(404).json({ message: "Logged-in user not found" });
    }

    // Check if already following
    const alreadyFollowing = loggedUser.followingUsers.includes(id);


    /* 
      Following = Number / Integer 
      Followers = Number / Integer 
      FollowedBy = nagfofollow saken 
      FollowingUsers = finofollow ko 
    */

    if (alreadyFollowing) {
      // Remove following relationship
      loggedUser.followingUsers = loggedUser.followingUsers.filter(
        (followingId) => followingId.toString() !== id.toString()
      );
      loggedUser.following--; // Reduce following count

      followingUser.followedBy = followingUser.followedBy.filter(
        (followerId) => followerId.toString() !== userId.toString()
      );
      followingUser.followers--; // Reduce followers count
    } else {
      // Add following relationship
      loggedUser.followingUsers.push(id);
      loggedUser.following++; // Increase following count

      followingUser.followedBy.push(userId);
      followingUser.followers++; // Increase followers count
    }

    // Save both users
    await loggedUser.save();
    await followingUser.save();

    // Respond with success message
    return res.status(200).json({
      message: alreadyFollowing
        ? "Unfollowed user successfully"
        : "Followed user successfully",
      followingUsers: loggedUser.followingUsers,
      followers: followingUser.followedBy,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating follow status" });
  }
};

const getUserWithFollowStatus = async (req, res) => {
  const { id } = req.params;
  const loggedInUserId = req.user._id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = user.followedBy.includes(loggedInUserId.toString());

    res.status(200).json({
      _id: user._id,
      username: user.username,
      profile: user.profile,
      followers: user.followers,
      following: user.following,
      isFollowing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user with follow status" });
  }
}


module.exports = {
  getUsers,
  getUser,
  signup,
  deleteUser,
  updateUser,
  login,
  getUserPosts,
  followUser,
  getUserWithFollowStatus,
}