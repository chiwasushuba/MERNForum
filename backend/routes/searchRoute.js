const express = require("express")
const {
  searchTitlePost,
  searchPeople,
  searchEverything
} = require("../controllers/searchController")

const router = express.Router()

router.get("/", searchEverything)

router.get("/posts", searchTitlePost)

router.get("/users", searchPeople)


module.exports = router




