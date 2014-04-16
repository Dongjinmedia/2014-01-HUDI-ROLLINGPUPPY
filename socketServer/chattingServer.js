//socket.io Module load
var socketio = require('socket.io');
//3080포트에 대해 listening
var io = socketio.listen(3080);

//Socket Connection
io.sockets.on('connection', function (socket) {
	
	//Room join
	//사용자 접속 시 Room Join및 접속한 사용자들 Room참여 인원들에게 알립니다.
	//'join'에 대한 요청을 받고 있는 function입니다.
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