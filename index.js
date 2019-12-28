const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;
const numOfUsers = [];
const loggedInUsers = [];

server.listen(port, function() {
  console.log(`Server is running on port ${port}`);
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
  numOfUsers.push(socket);
  console.log('Users connected: %s', numOfUsers.length);

  socket.on('sendMessage', function(msg) {
    console.log(`Message on index.js: ${msg}`);
    io.emit('appendMessage', msg);
  });

  socket.on('add user', function(username) {
    console.log(`Username in index.js: ${username}`);
    socket.username = username;
    loggedInUsers.push(socket.username);
    io.emit('user joined', {
      username: socket.username,
      users: loggedInUsers,
    })
    io.emit('appendMessage', `${username} joined the chat.`);
  });

  socket.on('disconnect', function() {
    numOfUsers.pop(socket);
    console.log('User disconnected: %s Users connected', numOfUsers.length);
    console.log(loggedInUsers.indexOf(socket.username));
    io.emit('user left', {
      username: socket.username,

    });
    io.emit('appendMessage', 'User disconnected');
  });
  
})