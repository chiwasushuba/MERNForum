const Posts = require("../models/postModel");
const Users = require("../models/userModel");

const searchTitlePost = async (req, res) => {

  try{
    const query = (req.query.query || "").toLowerCase()
  
    const results = await Posts.find({
      title: { $regex: query, $options: "i" }
    })
  
    res.status(200).json({results})

  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const searchPeople = async (req, res) => {

  try{
    const query = (req.query.query || "").toLowerCase()

    const results = await Users.find({
      username : {$regex: query, $options: "i"}
    })

    res.status(200).json({results})

  } catch (error){
    res.status(400).json({error: error.message})
  }

}

const searchEverything = async (req, res) => {

  try{
    const query = (req.query.query || "") 

    if (!query.trim()) {
      return res.status(400).json({ error: "Empty search query" })
    }
    

    const resultsUsers = await Users.find({
      username : {$regex: query, $options: "i"}
    })

    const resultsPosts = await Posts.find({
      title: {$regex: query, $options: "i"}
    })

    res.status(200).json({resultsUsers, resultsPosts})

  } catch (error){
    res.status(400).json({error: error.message})
  }

}

module.exports = {
  searchTitlePost,
  searchPeople,
  searchEverything
}

