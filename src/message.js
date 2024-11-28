const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for 'message' event
  socket.on('message', (data) => {
    console.log('Message received:', data); // Log message on backend
    io.emit('message', data); // Broadcast message to all clients
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
