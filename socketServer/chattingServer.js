console.log('\u001b[32m', '=============Server Start=============');

//socket.io Module load
var socketio = require('socket.io');
//mysql-connect Module load
var mysql = require('mysql');
//For http Request To WebServer
var http = require('http');

//DB Connection에 대한 정보.
//정보를 기반으로 Connection Pool을 생성한다.
var pool = mysql.createPool({
	host		: '125.209.195.202',
	user		: 'next',
	database	: 'rolling_puppy',
	charset		: 'UTF8_GENERAL_CI',
	timezone	: 'local',
	password	: 'dlrudals'
});

//database 질의를 위해 사용하는 함수
//첫번째 인자 sql은 자바의 preparedStatement에 sql인자와 같은 형태이다.
//두번째 인자는 첫번째 인자의 sql에서 ?에 들어갈 항목들을 순차적으로 배열로 입력한다.
//예를들어 ( select * from tbl_member where email=?, nickname_adjective=?, nickname_noun=? )인 sql에 해당하는
//aInsertValues는 다음과 같을 수 있다. ['lvev9925@naver.com', '날으는', '윤성']
function requestQuery(sql, aInsertValues, callbackFunction) {
	
	//sql QueryGenerator. 
	//Like Java PreparedStatement Class
	var sql = mysql.format(sql, aInsertValues);	
	
	var resultData = pool.getConnection(function(err, connection) {
		//test
		console.log("sql : ", sql);
		//when error occur
		
		if (err) {
			console.log("error occur : ",err);
		}
		
		//connection request
		connection.query(sql, function(err, oResult) {
			
			//when error occur
			if (err) {
				console.log("Generate Sql Query Failed!!");
			}
			
			callbackFunction(oResult);
		});
	});
};

//3080포트에 대해 socket.io listening
var io = socketio.listen(3080);


/*************************
DB 연동에 대한 TODO LIST

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
		
		//데이터베이스에 요청할 쿼리문. requestQuery에 인자로 전달한다.
		var query = "SELECT id, nickname_noun, nickname_adjective FROM tbl_member WHERE email = ?";
		
		//data.email은 client에서 전달하는 회원의 이메일주소를 담고 있다. 이메일 주소에는 ".com"과 같이 '.'이 무조건 포함되기 때문에, 아래와 같이 이스케이프 한다.
		//sql Query요청시 내부적으로 SQL Injection을 막기위한 검증을한다.
		//그때, 자동으로 '.'을 읽어서 split하기 때문에 쿼리 요청전 이스케이프 처리를 해야한다.
		var emailEscape = data.email.replace(".", "\.")
		
		//데이터베이스 쿼리가 종료된 후 실행될 callback함수, requestQuery에 인자로 전달한다.
		var callback = function(oResult) {				
				//console.log('\u001b[32m', "Result From Query -> oResult : ", oResult);
				
								
				//TODO 결과가 없을때를 대비한 error event를 만들자
				//if ( userId === undefined || userId === null ) 
				//	socket.emit('error', message);
				socket.set('userId', oResult["id"]);
				socket.set('nickname', oResult['nickname_noun']+oResult['nickname_adjective']);
				
				//마커에 저장된 정보가 전달된다.
				//마커에 저장되어있던 정보(room number)에 대한 소켓에 참여합니다.
				socket.join(data.chatRoomNumber);
		};
		
		//데이터베이스 쿼리를 요청한다.
		requestQuery(query, [emailEscape], callback);		
		
		//Save Attribute
		socket.set('chatRoomNumber', data.chatRoomNumber);
		
		//Get Attribute
		//Room에 있는 모두에게 참여메시지를 보냅니다.
		socket.get('room', function (error, room){
			io.sockets.in(room).emit('join', data.email);
		});
	});
	
	//Message 전송에 대해 Listening하고 있는 함수
	socket.on('message', function(message) {
		
		//Get Attribute
		socket.get('room', function(error, room) {
			//Room에 있는 모두에게 참여메시지를 보냅니다.
			io.sockets.in(room).emit('message', message );
		});
	});
	
	//Connection을 끊거나, 끊겼을경우
	socket.on('disconnect', function() {
		socket.get('room', function(error, room) {
			//Room에 있는 모두에게 이탈메시지를 보냅니다.
			io.sockets.in(room).emit('message', room );
		});
	});
});


//Webserver와의 통신을 위한 http 관련 소스코드
//현재는 테스트코드 레벨이다.
oHttpRequest= {
	options: {
	  host: 'localhost',
	  path: '/getId',
	  port: '8080',
	  method: 'GET'
	},
	callback: function(response) {
	  var str = ''
	  response.on('data', function (chunk) {
	    str += chunk;
	  });

	  response.on('end', function () {
	    console.log(str);
	  });
	},
	initialize: function() {
		var req = http.request(this.options, this.callback);
		req.end();
	}
};