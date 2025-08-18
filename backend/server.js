require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const http = require('http');
const { Server } = require('socket.io');

const fs = require('fs');
const path = require('path');

// Create uploads folder if not exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Online users tracking
const onlineUsers = new Map();


io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('join', ({ userId, username }) => {
    if (!userId || !username) {
      console.log('Join event missing userId or username');
      return;
    }

    socket.join(userId);
    socket.data.userId = userId;
    socket.data.username = username;

    onlineUsers.set(socket.id, { userId, username });
    console.log(`User ${username} (${userId}) joined`);

    io.emit('online_users', Array.from(onlineUsers.values()));
  });

  socket.on('disconnect', () => {
    if (socket.data.username) {
      console.log(`User ${socket.data.username} (${socket.data.userId}) disconnected`);
    }
    onlineUsers.delete(socket.id);
    io.emit('online_users', Array.from(onlineUsers.values()));
  });
});


// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
const userRoutes = require('./routes/userRoute');
const postRoutes = require('./routes/postRoute');
const otpRoutes = require("./routes/otpRoute");
const searchRoutes = require("./routes/searchRoute");
const chatRoutes = require('./routes/chatRoute')(io); // need io here because of socket.io integration

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/chat", chatRoutes);

// Connect DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log("listening to port " + process.env.PORT);
      console.log("connected to db");
    });
  })
  .catch((error) => {
    console.log(error);
  });
