const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// const port = process.env.PORT || 3000;

let users = {}; // Store users and their corresponding socket IDs

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT || 3000}`);
});

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('A user connected');

  // Store the user's socket ID
  socket.on('register', (username) => {
    users[username] = socket.id;
    console.log(`${username} connected`);
    io.emit('updateUserList', Object.keys(users)); // Broadcast updated user list
  });

  // Listen for 'message' event
  socket.on('message', (data) => {
    console.log('Message received:', data);
    const messageData = {
      username: data.username,
      message: data.message,
    };
    // Broadcast message to all connected clients
    io.emit('message', messageData);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    for (let username in users) {
      if (users[username] === socket.id) {
        delete users[username];
        console.log(`${username} disconnected`);
        io.emit('updateUserList', Object.keys(users)); // Broadcast updated user list
        break;
      }
    }
  });
});
