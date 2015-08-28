var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(appRoot + '/app/frontend/index.html');
});

app.use('/static', express.static(appRoot + '/build/static'));

io.on('connection', function(socket){
  console.log('%s connected',socket.id);
  socket.on('disconnect', function(){
    console.log('%s disconnected',socket.id);
  });
});

http.listen(8000, function(){
  console.log('listening on *:8000',arguments);
});