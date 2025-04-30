const express = require("express")
const {
  searchTitlePost
} = require("../controllers/searchController")

const router = express.Router()

router.get("/", searchTitlePost)

module.exports = router




