var socketio = require('socket.io'), http = require('http'), express = require('express'), fs = require('fs');

var app = express();
app.set('port', 3080);
var server = http.createServer(app).listen(app.get('port'), function() {
	console.log("express server listening on port " + app.get('port'));
})

app.get('/', function (request, response) {
	fs.readFile('main.html', function (error, data) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end(data);
	});
})

var io = socketio.listen(server);

//Socket Connection
io.sockets.on('connection', function (socket) {
	
	//Room join
	//사용자 접속 시 Room Join및 접속한 사용자들 Room참여 인원들에게 알립니다.
	socket.on('join', function(data) {
		
		//Socket Join을 합니다.
		socket.join(data.roomname);
		
		socket.set('room', data.roomname);
		
		//Room Join인원들에게 메시지를 보냅니다.
		socket.get('room', function (error, room){
			io.sockets.in(room).emit('join', data.userid);
		});
	});
	
	//Message
	socket.on('message', function(message) {
		socket.get('room', function(error, room) {
			io.sockets.in(room).emit('message', message);
		});
//		io.sockets.emit('message', message);
	});
	socket.on('disconnect', function() {});
})
