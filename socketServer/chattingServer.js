//socket.io Module load
var socketio = require('socket.io');
//mysql-connect Module load
var mysql = require('mysql');

//Use Connection Pool
var pool = mysql.createPool({
	host		: '10.73.45.135',
	user		: 'root',
	database	: 'rolling_puppy',
	charset		: 'UTF8_GENERAL_CI',
	timezone	: 'local',
	password	: 'dlrudals'
});


function requestQuery(sql, ainsertValues) {
	
	//sql QueryGenerator. 
	//Like Java PreparedStatement Class
	var sql = mysql.format(sql, ainsertValues);
	
	//===test code
	console.log(sql);
	
	
	var resultData = pool.getConnection(function(err, connection) {
		
		//when error occur
		if (err) {
			console.log("error occur");
		}
		
		//connection request
		connection.query(sql, function(err, queryResult) {
			
			//when error occur
			if (err) {
				console.log("Generate Sql Query Failed!!");
			}
			
			//===test code
			console.log("results : ", queryResult);
			
			return queryResult;
		});
	})
	
	console.log("query : ", resultData);
//	console.log("query.sql : ", query.sql);
}

//3080포트에 대해 socket.io listening
var io = socketio.listen(3080);


/*************************
DB 연동에 대한 TODO LIST

1. Flow

* 유저가 채팅방을 개설
INSERT tbl_chat_room

* 유저가 채팅방에 입장
INSERT tbl_chat_room_has_tbl_member

* 유저가 채팅을 입력
INSERT tbl_message
*************************/


//Socket Connection
io.sockets.on('connection', function (socket) {
	
	//Room join
	//사용자 접속 시 Room Join및 접속한 사용자들 Room참여 인원들에게 알립니다.
	//'join'에 대한 요청을 받고 있는 function입니다.
	socket.on('join', function(data) {
		
		//마커에 저장된 정보가 전달된다.
		//생성은 웹서버단에서 처리.
		console.log("in join : ", requestQuery("SELECT * FROM ??", ['tbl_member']));
		
		//마커에 저장되어있던 정보(room number)에 대한 소켓에 참여합니다.
		socket.join(data.roomNumber);
		
		//Save Attribute
		socket.set('room', data.roomNumber);
		
		//Get Attribute
		//Room에 있는 모두에게 참여메시지를 보냅니다.
		socket.get('room', function (error, room){
			io.sockets.in(room).emit('join', data.userid);
		});
	});
	
	//Message 전송에 대해 Listening하고 있는 함수
	socket.on('message', function(message) {
		
		//Get Attribute
		socket.get('room', function(error, room) {
			//Room에 있는 모두에게 참여메시지를 보냅니다.
			io.sockets.in(room).emit('message', message);
		});
	});
	
	//Connection을 끊거나, 끊겼을경우
	socket.on('disconnect', function() {
		socket.get('room', function(error, room) {
			//Room에 있는 모두에게 참여메시지를 보냅니다.
			io.sockets.in(room).emit('message', message);
		});
	});
})