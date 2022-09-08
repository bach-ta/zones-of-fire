const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);

// Whenever a client connects
io.on('connection',  (sock) => {
    // sock.emit sends value to connected client only
    sock.emit('message', 'You are connected');

    // sock.on listens to <event_1> from client with <value_1>, then 
    // io.emit broadcasts <event_2> with <value_2> to everyone connected
    // sock.on(<event_1>, <value_1> => io.emit(<event_2>, <value_2>))
    
    sock.on('message', (text) => io.emit('message', text));
    sock.on('player', (player) => io.emit('obj', player));
});

server.on('error', (err) => {
    console.error(err);
})

server.listen(8080, () => {
    console.log('server is ready');
})
