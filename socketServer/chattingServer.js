console.log('\u001b[1m');
console.log('\u001b[32m', '=============Server Start=============');

//socket.io Module load
var socketio = require('socket.io');
//mysql-connect Module load
var mysql = require('mysql');

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
		connection.query(sql, function(err, queryResult) {
			
			//when error occur
			if (err) {
				console.log("Generate Sql Query Failed!!",err);
			}
			
			callbackFunction(queryResult);
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
		
		
		/********************************************************************************************************************/		
		//데이터베이스에 요청할 쿼리문. requestQuery에 인자로 전달한다.
		var query = "SELECT id, nickname_noun, nickname_adjective FROM tbl_member WHERE email = ?";
		
		//data.email은 client에서 전달하는 회원의 이메일주소를 담고 있다. 이메일 주소에는 ".com"과 같이 '.'이 무조건 포함되기 때문에, 아래와 같이 이스케이프 한다.
		//sql Query요청시 내부적으로 SQL Injection을 막기위한 검증을한다.
		//그때, 자동으로 '.'을 읽어서 split하기 때문에 쿼리 요청전 이스케이프 처리를 해야한다.
		var emailEscape = data.email.replace(".", "\.")
		
		//데이터베이스 쿼리가 종료된 후 실행될 callback함수, requestQuery에 인자로 전달한다.
		//채팅방 입장시 수행할 내용들
		//TODO tbl_chat_room 에서 채팅방 상태값도 변경해주어야 한다. (팀원들과 논의)
		//Select Query는 반환되는 인자값이 Array타입이다. [tuple1, tuple2, tuple3....] 각각의 tuple은 object이다.
		var callback = function(aResult) {				
				console.log('\u001b[32m', "Result From Query -> oResult : ", aResult);
				
				var tuple = aResult[0];
				//TODO 결과가 없을때를 대비한 error event를 만들자
				//if ( userId === undefined || userId === null ) {
					//	socket.emit('error', message);
					//return;
				//} 
				
				
				socket.set('userId', tuple["id"]);
				socket.set('nickname', tuple['nickname_noun']+tuple['nickname_adjective']);
				
				// 이미 채팅방에 입장해있는 사람인지 확인한 뒤
				// Insert를 통해 입장을 시킨다.
				requestQuery(
					"SELECT * FROM tbl_chat_room_has_tbl_member WHERE tbl_chat_room_id = ? AND tbl_member_id = ?",
					[data.chatRoomNumber, tuple["id"]],
					function(aResult){
						if (aResult[0] === undefined) {
							console.log("채팅방에 참여하지 않은 유저");

							//tbl_chat_room_has_tbl_member에 대한 쿼리실행
							requestQuery(
								"INSERT INTO tbl_chat_room_has_tbl_member(tbl_chat_room_id, tbl_member_id) VALUES (?, ?)",
								[data.chatRoomNumber, tuple["id"]],
								
								//Insert Query는 반환되는 값이 Object타입이다.
								//
								//ex)
								// { 
								//  fieldCount: 0,
								//  affectedRows: 1,
								//  insertId: 0,
								//  serverStatus: 2,
								//  warningCount: 0,
								//  message: '',
								//  protocol41: true,
								//  changedRows: 0 
								// }
								function(oResult) {
									var affectedRows = oResult["affectedRows"];
									
									//TODO 결과가 없을때를 대비한 error event를 만들자						
									//if (oResult !== undefined, oResult !== null)
									//if ( affectedRows !== 1 ) {
									//	socket.emit('error', message);
									// 	return;
									//} else {
										
									//마커에 저장된 정보가 전달된다.
									//마커에 저장되어있던 정보(room number)에 대한 소켓에 참여합니다.
									socket.join(data.chatRoomNumber);
								}
							);	

						}
						else {
							 console.log("CHATTING ROOM ID : " + aResult[0]["tbl_chat_room_id"]);
							 console.log("MEMBER ID : " + aResult[0]["tbl_member_id"]);
						}
					}
				);

		};
		/********************************************************************************************************************/
		
		
		
		//데이터베이스 쿼리를 요청한다.
		requestQuery(query, [emailEscape], callback);		
		
		//Save Attribute
		socket.set('chatRoomNumber', data.chatRoomNumber);
		
		//Get Attribute
		//Room에 있는 모두에게 참여메시지를 보냅니다.
		socket.get('chatRoomNumber', function (error, room){
			io.sockets.in(room).emit('join', data.email);
		});
	});
	
	//Message 전송에 대해 Listening하고 있는 함수
	socket.on('message', function(message) {
		//Get Attribute
		socket.get('chatRoomNumber', function(error, chatRoomNumber) {
			socket.get('userId', function (error, userId){
				requestQuery(
					//Param1
					"INSERT INTO tbl_message (tbl_chat_room_id, tbl_member_id, message) VALUES (?, ?, ?)",
					//Param2
					[chatRoomNumber, userId, message],
					//Param3
					function(oResult) {
						var affectedRows = oResult["affectedRows"];
					
						//TODO 결과가 없을때를 대비한 error event를 만들자						
						//if ( affectedRows !== 1 ) {
						//	socket.emit('error', message);
						// 	return;
						//} else {
						
						//Room에 있는 모두에게 참여메시지를 보냅니다.
						io.sockets.in(chatRoomNumber).emit('message', message );
					}
				);					
			});
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
	http: null,
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
		this.http = require('http');
		var req = http.request(this.options, this.callback);
		req.end();
	}
};

console.log('\u001b[1m');
