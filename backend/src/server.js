const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect(process.env.MONGODB_KEY, { useNewUrlParser: true, useUnifiedTopology: true });

const connectedUsers = {}; //TODO 1: store somewhere (redis?)
io.on('connection', (socket) => {
    const { user_id } = socket.handshake.query;
    connectedUsers[user_id] = socket.id;
    console.log(connectedUsers);
    socket.emit('hello', 'world');
});
app.use((req, res, next) => { //middleware
    req.io = io;
    req.connectedUsers = connectedUsers;
    next();
});

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333);
