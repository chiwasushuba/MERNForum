const mongoose = require("mongoose")

const Schema = mongoose.Schema

// ADD COMMENTS SCHEMA IN THE FUTURE


const postSchema = new Schema({
  title:{
    type: String,
    required: true,

  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This tells Mongoose to reference the User model
    required: true,
  },

  content:{
    type: String,
    required: true,
  },

  photo:{
    type: String,
    default: "",
  },

  video:{
    type: String,
    default: "",
  },

  likes:{
    type: Number,
    default: 0
  },

  dislikes:{
    type: Number,
    default: 0
  }

}, {timestamps: true})

module.exports = mongoose.model("Post", postSchema)


