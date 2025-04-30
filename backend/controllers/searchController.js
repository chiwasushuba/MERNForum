const Posts = require("../models/postModel")

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

module.exports = {
  searchTitlePost
}

