const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const animals = require('./animals.json');
const colors = require('./colors.json');


app.use(express.static('public'));

app.get('/', (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

io.on('connection', (socket) => {
  socket.username = animals[Math.floor(Math.random() * animals.length)];
  socket.color = colors[Math.floor(Math.random() * colors.length)];

  socket.broadcast.emit('announcement', `${socket.username} joined the room`);

  socket.on('message', (message) => {
    socket.broadcast.emit('message', socket.username, socket.color, message);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('announcement', `${socket.username} left the room`);
  });
});

http.listen(process.env.PORT || 8080);
