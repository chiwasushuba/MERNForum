require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const http = require('http');             
const { Server } = require('socket.io');


// basta yung routes
const userRoutes = require('./routes/userRoute');
const postRoutes = require('./routes/postRoute');
const otpRoutes = require("./routes/otpRoute");
const searchRoutes = require("./routes/searchRoute")
const messageRoutes = require('./routes/messageRoute');

// Automatic Folder Creator
const fs = require('fs');
const path = require('path');


// for multer (Automatic Folder Maker)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// creates APP in express to access the whole backend application
const app = express();

// creates server for socket.io so that it can be merged with express app
const server = http.createServer(app);


// BELOW IS THE SOCKET.IO IMPLEMENTATION
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Change as needed for frontend URL
    methods: ['GET', 'POST']
  }
});

const onlineUsers = new Map(); // socket.id -> { userId, username }

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join', ({ userId, username }) => {
    socket.join(userId);
    socket.data.userId = userId;
    socket.data.username = username;

    onlineUsers.set(socket.id, { userId, username });
    console.log(`User ${username} (${userId}) joined`);

    // Send updated list to everyone
    io.emit('online_users', Array.from(onlineUsers.values()));
  });

  socket.on('disconnect', () => {
    const userId = socket.data.userId;
    const username = socket.data.username;

    console.log(`User ${username || 'unknown'} disconnected`);

    if (onlineUsers.has(socket.id)) {
      onlineUsers.delete(socket.id);
      io.emit('online_users', Array.from(onlineUsers.values()));
    }
  });
});



// ABOVE IS THE SOCKET.IO IMPLEMENTATION


// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// IMPORTANT: Serve static files from uploads directory (for multer)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
})


//Routes
app.use("/api/user",userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/otp", otpRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/messages", messageRoutes)




// Connect DB and Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log("listening to port " + process.env.PORT);
      console.log("connected to db")
    })
  })
  .catch((error) => {
    console.log(error)
  })


