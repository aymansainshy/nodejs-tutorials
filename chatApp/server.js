const path = require('path');
const http = require('http'); // This express used under the hood , but we needed in order to use Socket.IO 
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeaves, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app); // This refer to abov commment ...
const io = socketio(server);


// Set Static files 
app.use(express.static(path.join(__dirname, 'public')));

const chatAppName = 'A1Chat';

// Run when client connect ..
io.on('connection', (socket) => {
    console.log("Ne WS connection ...");

    socket.on("joinRoom", ({ username, room }) => {
        console.log(username, room);
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user ......
        socket.emit('message', formatMessage(chatAppName, `Welcome to A1Chat ${user.userName}`));

        // Broadcast when a user connects ...... excep the user that connect .... to() mean to  socket Room that user joined .. on socket.join Function ..
        socket.broadcast.to(user.room).emit('message', formatMessage(chatAppName, `${user.userName} has joined the chat ...`));

        // Send users and room info 
        io.to(user.room).emit('roomUser', { room: user.room, users: getRoomUsers(user.room) })
    });


    // Listening to chatMessge 
    socket.on('chatMessage', (message) => {
        const user = getCurrentUser(socket.id);
        // io.emit for all user connecting to server .....
        console.log(`from Client  ${user.userName} - ${message}`);
        io.to(user.room).emit('message', formatMessage(user.userName, message));
    });


    // Run when client disconnects 
    socket.on('disconnect', () => {
        // const user = getCurrentUser(socket.id);
        const user = userLeaves(socket.id);
        if (user) {
            // io.emit for all user connecting to server ..... 
            io.to(user.room).emit('message', formatMessage(chatAppName, `${user.userName} has left the chat ..`));

            // Send Update (users and room) info .....
            io.to(user.room).emit('roomUser', { room: user.room, users: getRoomUsers(user.room) })
        }
    });
})


const PORT = 3000 || process.env.PORT;

server.listen(PORT, 'localhost', () => {
    console.log(`Server running on port ${PORT}`);
});