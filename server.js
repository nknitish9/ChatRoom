const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (username) => {
        socket.username = username;
        io.emit('systemMessage', `${username} joined the conversation`);
    });

    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', { user: socket.username, text: msg });
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('systemMessage', `${socket.username} left the conversation`);
        }
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
