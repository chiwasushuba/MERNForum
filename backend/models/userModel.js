const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const validator = require("validator")

const Schema = mongoose.Schema

const userSchema = new Schema({
  email:{
    type: String,
    required: true,
  },

  username:{
    type: String,
    required: true,
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
  }

}, {timestamp: true})

userSchema.statics.signup = async function(email, username, password){

  // if username == null
  // if password == null
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if(!username || !password){
    throw Error("Both fields must be filled")
  } 

  const exists = await this.findOne({username})

  if(exists){
    throw Error(username + " already exists")
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({email, username, password: hash})

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


