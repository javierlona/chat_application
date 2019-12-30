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
    msg = `${socket.username}: ${msg}`;
    io.emit('appendMessage', msg);
  });

  socket.on('add user', function(username) {
    socket.username = username;
    loggedInUsers.push(socket.username);
    io.emit('user joined', {
      username: socket.username,
      users: loggedInUsers,
    })
    io.emit('appendMessage', `${username} joined the chat.`);
  });

  socket.on('disconnect', function() {
    let nameOfUserLeaving = socket.username;
    
    loggedInUsers.splice(loggedInUsers.indexOf(nameOfUserLeaving), 1);
    numOfUsers.pop(socket);
    console.log('User disconnected: %s Users connected', numOfUsers.length);
    io.emit('user left', {
      username: nameOfUserLeaving,
      users: loggedInUsers,
    });
    io.emit('appendMessage', `${nameOfUserLeaving} left the chat.`);
  });
  
})