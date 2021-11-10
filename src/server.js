const http = require('http');
const app = require('./app');
const {Server} = require('socket.io');

const socket_controller = require("./controllers/socket.controller");

const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: ["http://127.0.0.1:5500"]
    }
})

io.on("connection", (socket) => {
    socket.broadcast.emit("hello", "world");
    socket_controller(socket);
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running! port: ${port} `);
});


module.exports = io;