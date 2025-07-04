const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
// const validator = require("validator")

const Schema = mongoose.Schema

const userSchema = new Schema({
  email:{
    type: String,
    default:""
  },

  username:{
    type: String,
    required: true,
    unique: true
  },

  password:{
    type: String,
    required: true,
  },

  profile:{
    type: String,
    default: "https://img.pokemondb.net/sprites/sword-shield/normal/charizard.png",
  },

  bio:{
    type: String,
    default: "Im a bum",
  },

  followers:{
    type: Number,
    default: 0,
  },

  following:{
    type: Number,
    default: 0
  },


  // being followed
  followedBy:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],

  // following
  followingUsers:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  
  verified:{
    type: Boolean,
    default: false
  }

}, {timestamp: true})

userSchema.statics.signup = async function(username, password){

  if(!username || !password){
    throw Error("Both fields must be filled")
  } 

  const exists = await this.findOne({username})

  if(exists){
    throw Error(username + " already exists. Use another username!!!")
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({username, password: hash})

  return user
}

userSchema.statics.login = async function(username, password){

  if(!username || !password){
    throw Error("Both fields must be filled")
  }

  const user = await this.findOne({username})

  if(!user){
    throw Error("Username is incorrect")
  }

  const match = await bcrypt.compare(password, user.password)

  if(!match){
    throw Error("Password is incorrect")
  }

  return user
}

module.exports = mongoose.model("User", userSchema)


