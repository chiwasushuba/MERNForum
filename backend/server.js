require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");


const userRoutes = require('./routes/userRoute');
const postRoutes = require('./routes/postRoute')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
})

//Routes
app.use("/api/user",userRoutes);
app.use("/api/post", postRoutes);

// Connect DB and Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("listening to port " + process.env.PORT);
      console.log("connected to db")
    })
  })
  .catch((error) => {
    console.log(error)
  })
