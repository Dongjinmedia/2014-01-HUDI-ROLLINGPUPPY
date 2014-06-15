console.log('\u001b[0m');
console.log('\u001b[32m', '=============Server Start=============');
console.log('\u001b[0m');

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
	password	: 'dlrudals',
	connectionLimit : 30
});

//메세지 전송시 데이터셋을 만들기위한 배열
var aWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//중복되는 코드를 제거하기위한 함수
//null 혹은 undefined여부를 체크한다.
function isUndefinedOrNull(data) {
	return (data === undefined || data === null)
}

//database 질의를 위해 사용하는 함수
//첫번째 인자 sql은 자바의 preparedStatement에 sql인자와 같은 형태이다.
//두번째 인자는 첫번째 인자의 sql에서 ?에 들어갈 항목들을 순차적으로 배열로 입력한다.
//예를들어 ( select * from tbl_member where email=?, nickname_adjective=?, nickname_noun=? )인 sql에 해당하는
//aInsertValues는 다음과 같을 수 있다. ['lvev9925@naver.com', '잘생긴', '윤성']
function requestQuery(sql, aInsertValues, callbackFunction) {
	//sql QueryGenerator. 
	//Like Java PreparedStatement Class
	var sql = mysql.format(sql, aInsertValues);	
	var resultData = pool.getConnection(function(err, connection) {

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
		})
		
		connection.release();
	});
};

//3080포트에 대해 socket.io listening
var io = socketio.listen(3080);
//io.set('close timeout', 60);
//io.set('heartbeat timeout', 60);


//Socket Connection	
io.sockets.on('connection', function (socket) {


//**************************************************************************************
// 최초 Connection이 연결될때 실행되는 소스코드
//***************************************************************************************
	//최초 Connection을 맺을때 사용자의 아이디를 socket에 저장해놓고
	//계속적으로 사용합니다. 이 아이디값은 각 소켓별로 다르게 관리됩니다.
	//
	//TODO 잘못된 사용을 방지하기 위해 회원의 아이디, 이메일정보를 모두 전달받아서 확인합니다.
	//TODO Log console.log("query : ",socket.handshake.query);
	
	if (
		!isUndefinedOrNull(socket.handshake.query.userId)
		&&
		!isUndefinedOrNull(socket.handshake.query.email)
		&&
		!isUndefinedOrNull(socket.handshake.query.domain)
	) {
		
		var userId = socket.handshake.query.userId;
		var email = socket.handshake.query.email;
		var domain = socket.handshake.query.domain;

		//data.email은 client에서 전달하는 회원의 이메일주소를 담고 있다. 이메일 주소에는 ".com"과 같이 '.'이 무조건 포함>    되기 때문에, 아래와 같이 이스케이프 한다.
		//sql Query요청시 내부적으로 SQL Injection을 막기위한 검증을한다.
		//그때, 자동으로 '.'을 읽어서 split하기 때문에 쿼리 요청전 이스케이프 처리를 해야한다.
		domain = domain.replace(".", "\.")
		/********************************************************************************************************************/		
		var query = "SELECT * FROM tbl_member WHERE id = ? AND email = ?";
		
		var aQueryValues = [userId, email+"@"+domain];
		
		var callback = function(aResult) {
			//회원이 존재하지 않을경우
			//TODO Log console.log("aResult : ",aResult);
			if (isUndefinedOrNull(aResult)) {
				console.log("unexpected error occur");
				return;
			}
			
			
			if ( aResult.length === 0 ) {
				//TODO
				//announce("잘못된 접근");
				return;
			} else {
				var tuple = aResult[0];	
			}
			
			//정보저장
			socket.set("userId", userId);
			socket.set("nickname", tuple.nickname_adjective + " " + tuple.nickname_noun);			

		}.bind(this);
		/********************************************************************************************************************/
		requestQuery(query, aQueryValues, callback);


		// 사용자 로그인시 자동으로 접속해있는 채팅방과의 소켓 연결을 맺어줍니다.
		//이미 참여하고 있는 채팅방들에 대한 소켓연결을 해줘야 한다.
		//그를 위한 Query실행
		/********************************************************************************************************************/
		var reconnectQuery = "SELECT tbl_chat_room_id FROM tbl_chat_room_has_tbl_member WHERE tbl_member_id = ?";
		
		var aReconnectQueryValues = [userId];
		
		var reconnectCallback = function(aResult) {
			console.log("reconnect aResult : ",aResult);
			if (isUndefinedOrNull(aResult)) {
				console.log("unexpected error occur");
				return;
			}
			
			
			//기존에 참여하고 있던 채팅방이 없는 경우
			if ( aResult.length === 0 ) {
				//TODO
				//announce("잘못된 접근");
				return;

			//기존에 참여하던 채팅방이 존재하는경우
			} else {
				for (var i = 0 ; i < aResult.length ; ++i ) {
					var chatRoomId = aResult[i]["tbl_chat_room_id"];
					console.log('\u001b[32m', "Socket Connect With Entered Chatting Room -> chatRoomNumber : ", chatRoomId + '\u001b[0m');

					socket.join(chatRoomId);
				}
			}

		}.bind(this);
		/********************************************************************************************************************/		
		requestQuery(reconnectQuery, aReconnectQueryValues, reconnectCallback);

	}

//***************************************************************************************
// socket에서 사용하는 Util 함수들
//***************************************************************************************
			
	//userId를 socket으로부터 가져오는 함수
	function getUserId() {
		var returnValue = null;

		socket.get("userId", function(error, userId) {
			if ( error ) {
				console.log("get UserId Error Occur : ", error);	
			}
			returnValue = userId;
		});
		
		return returnValue;
	}
	
	function getUserNickname() {
		var returnValue = null;
		
		socket.get("nickname", function(error, nickname) {
			if ( error ) {
				console.log("get Nickname Error Occur : ", error);	
			} else {
				returnValue = nickname;
			}
		});
		
		return returnValue;
	}
	
	function announce(message) {
		socket.emit("announce", message);
	}
	
	function executeInClient(oCallback) {

		var tempCallback = ""+ oCallback.callback;
		tempCallback = tempCallback.replace("function", "");
		tempCallback = tempCallback.replace("()", "");
		tempCallback = tempCallback.replace("{", "");
		tempCallback = tempCallback.substring(0, tempCallback.length-1);

		oCallback.callback = tempCallback;
		socket.emit("execute", oCallback);
	}
	
	function executeAllClientInChattingRoom(chatRoomNumber, oCallback) {
		var tempCallback = ""+ oCallback.callback;
		tempCallback = tempCallback.replace("function", "");
		tempCallback = tempCallback.replace("()", "");
		tempCallback = tempCallback.replace("{", "");
		tempCallback = tempCallback.substring(0, tempCallback.length-1);

		oCallback.callback = tempCallback;

		io.sockets.in(chatRoomNumber).emit('execute', oCallback);	
	}

	function getMessageDataObject(userId, chatRoomNumber, message) {
		var date = new Date();
		
		var nHour = date.getHours();
		var nMinutes = date.getMinutes();

		if ( nHour.length === 1 ) {
			nHour = "0"+nHour;
		}

		if ( nMinutes.length === 1 ) {
			nMinutes = "0"+nMinutes;
		}

		var oMessageInfo = {
			"tblMemberId": userId,
			"tblChatRoomId": chatRoomNumber,
			"message": message,
			"month": date.getMonth()+1,
			"week": aWeek[date.getDay()],
			"day": date.getDate(),
			"time": nHour + ":" + nMinutes
		};
		
		return oMessageInfo;
	}
		
	function _sendMessage(userId, chatRoomNumber, message, callback) {
		
		//callback type
		//function() {
		// 1. send to current request socket client
		// socket.emit('message', "this is a test");

		// 2. sending to all clients, include sender
		//io.sockets.emit('message', "this is a test");

		// 3. sending to all clients except sender
		//socket.broadcast.emit('message', "this is a test");

		// 4. sending to all clients in 'game' room(channel) except sender
		// socket.broadcast.to('game').emit('message', 'nice game');

		// 5. sending to all clients in 'game' room(channel), include sender
		// io.sockets.in('game').emit('message', 'cool game');

		// 6. sending to individual socketid
		//io.sockets.socket(socketid).emit('message', 'for your eyes only');	
		//}
		
		
		
		//javascript data schema.
		/*
			var eTarget = null;
			var day = oMessageInfo["day"];
			var month = oMessageInfo["month"];
			var time = oMessageInfo["time"];
			var week = oMessageInfo["week"];
			var message = oMessageInfo["message"];
			var isMyMessage = oMessageInfo["isMyMessage"];
			var chatRoomNum = oMessageInfo["tblChatRoomId"];
			var memberId = oMessageInfo["tblMemberId"];
		*/

		requestQuery(
			//Param1
			"INSERT INTO tbl_message (tbl_chat_room_id, tbl_member_id, message) VALUES (?, ?, ?)",
			//Param2
			[chatRoomNumber, userId, message],
			//Param3
			function(oResult) {
				if ( isUndefinedOrNull(oResult) ) {
					announce("메세지 전송중 에러가 발생했습니다.\n잠시후 다시 시도해주세요.");
					return;
				}


				var affectedRows = oResult["affectedRows"];
				
				//TODO 결과가 없을때를 대비한 error event를 만들자						
				if ( affectedRows === 0 ) {
					//TODO socket.emit('error', "message");
					return;
				} else {
					
					//client에서 사용하고있는 dataset에 맞춰서 object를 만듭니다.
					var oMessageInfo = getMessageDataObject(userId, chatRoomNumber, message);
					callback(oMessageInfo);
				}
			}
		);	
	}
	
	//일반적인 메세지 전송시 사용하는 함수
	function sendMessageToChatRoomMembers(userId, chatRoomNumber, message) {
		var callback = function(oMessageInfo) {
			//Room에 있는 모두에게 새로운 메시지를 보냅니다.
			io.sockets.in(chatRoomNumber).emit('message', oMessageInfo);
		};
		_sendMessage(userId, chatRoomNumber, message, callback)
	}
	
	//공지글 (입장, 퇴장, 운영상에 필요한 메세지 전달) 등을 위한 함수.
	//클라이언트에서는 메세지 생성자 id를 판별해서 0일경우 admin Message로 처리하도록 되어있다.
	function sendAdminMessageToChatRoomMembers(chatRoomNumber, message) {
		sendMessageToChatRoomMembers(0, chatRoomNumber, message);
	}

	//sender를 제외한 Room에 있는 모두에게 새로운 공지메시지를 보냅니다.	
	function sendAdminMessageToChatRoomMembersExceptSender(chatRoomNumber, message) {
		sendMessageToChatRoomMembersExceptSender(0, chatRoomNumber, message);
	}

	//sender를 제외한 Room에 있는 모두에게 새로운 메시지를 보냅니다.	
	function sendMessageToChatRoomMembersExceptSender(userId, chatRoomNumber, message) {
		var callback = function(oMessageInfo) {

		 	socket.broadcast.to(chatRoomNumber).emit('message', oMessageInfo);
		};
		_sendMessage(userId, chatRoomNumber, message, callback)
	}

//***************************************************************************************
// 클라이언트의 요청에 대한 Listening함수들 시작
//***************************************************************************************

	//Room join
	//사용자 접속 시 Room Join및 접속한 사용자들 Room참여 인원들에게 알립니다.
	//'join'에 대한 요청을 받고 있는 function입니다.	
	socket.on('join', function(data) {
		
		//데이터체크
		if (isUndefinedOrNull(data)) {
			announce("방입장중 에러가 발생했습니다.\n다시 시도해주세요.");
			return;
		}
		
		var userId = getUserId();
		var chatRoomNumber = data.chatRoomNumber;
			
		//TODO Log console.log("userId : ",userId);
		//TODO Log console.log("chatRoomNumber : ", chatRoomNumber);
		if ( isUndefinedOrNull(userId) || isUndefinedOrNull(chatRoomNumber)) {
			announce("방입장중 에러가 발생했습니다.\n다시 시도해주세요.");
			return;
		}
		
		/********************************************************************************************************************/
		var query = "SELECT " 
						+"SUM(t_both.tbl_member_id = ?) AS is_already_join, "
						+"(t_chat.max <= count(t_both.tbl_member_id)) AS is_full "
					+"FROM tbl_chat_room_has_tbl_member AS t_both "
					+"INNER JOIN tbl_chat_room AS t_chat "
					+"ON t_chat.id = t_both.tbl_chat_room_id "
					+"WHERE t_both.tbl_chat_room_id = ?";

		var aQueryValues = [userId, data.chatRoomNumber];
		
		//데이터베이스 쿼리를 요청한다.
		requestQuery(query, aQueryValues, function(aResult) {
			
			if ( isUndefinedOrNull(aResult) || isUndefinedOrNull(aResult[0])) {
				announce("방입장중 에러가 발생했습니다.\n다시 시도해주세요.");
				return;
			}
			
			var oResult = aResult[0];
			console.log("aResult : ",aResult);
			var isAlreadyJoin = oResult["is_already_join"];
			var isFull = oResult["is_full"];
			
			console.log("isAlreadyJoin : ",isAlreadyJoin);
			console.log("isFull : ",isFull);
			
			//이미 방에 입장한 사람일 경우
			if ( isAlreadyJoin === 1 ) {
				var oCallback = {
					callback: function() {
						oChat.showChatWindow(this.chatRoomNumber);
					},
					chatRoomNumber: chatRoomNumber
				};
				executeInClient(oCallback);
				
			//방에 입장하지 않은 사람일 경우
			} else {
				//방 상태가 이미 Full일경우
				if ( isFull === 1 ) {
					announce("방입장중 에러가 발생했습니다.\n다시 시도해주세요.");
					return;

				//방에 입장가능한 상태이고, 처음 입장한 사람일경우
				} else {
					/********************************************************************************************************************/
					var query = "INSERT INTO tbl_chat_room_has_tbl_member "
									+"(tbl_chat_room_id, tbl_member_id) "
								+"SELECT * FROM (SELECT ?, ?) AS tmp "
								+"WHERE NOT EXISTS "
									+"("
										+"SELECT "
											+"tbl_chat_room_id "
										+"FROM tbl_chat_room_has_tbl_member "
										+"WHERE tbl_chat_room_id = ? AND tbl_member_id = ?"
									+") LIMIT 1";

					var aQueryValues = [chatRoomNumber, userId, chatRoomNumber, userId];
					
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
					requestQuery(query, aQueryValues, function(oResult) {

						if ( isUndefinedOrNull(oResult) ) {
							announce("방입장중 에러가 발생했습니다.\n다시 시도해주세요.");
							return;
						}

						var affectedRows = oResult["affectedRows"];
						//TODO Log console.log("affectedRows : ",affectedRows);

						if ( affectedRows == 0 ) {
							announce("방입장중 에러가 발생했습니다.\n다시 시도해주세요.");
							return;
							
						} else {
							getChatInfoFromWebServer(chatRoomNumber, function(oResultFromWebServer) {
								
								console.log("oResult from parsing : ", oResultFromWebServer );
							
								//***************************for user
								socket.join(chatRoomNumber);
					
								var oCallback = {
									callback: function() {
										console.log("save data oCallbackFor User!!!!!!!!!");
										//리스트에 새로운 채팅방정보 더하기
										oAside.addChattingList(this.chatRoomNumber, this.oResult);
										//채팅윈도우 열기
										oChat.showChatWindow(this.chatRoomNumber);
									},
									oResult: oResultFromWebServer,
									chatRoomNumber: chatRoomNumber
								};
								//실행은 for everyone in SameChatRoom 실행 후 이루어져야 한다.
								//왜냐하면 데이터추가가 뒤에 되기 때문!!
								//***************************for user
						
						
								//***************************for everyone in SameChatRoom					
								var oCallbackForEveryOneInChatRoom = {
									callback: function() {
										//새로운데이터 추가.
										oChat.addChatInfo(this.chatRoomNumber, this.oResult);
							
										//현재 focus된 채팅방이 열려있을 경우,
										if ( oChat.currentChatRoomNumber == this.chatRoomNumber ) {
											oChat.addMemberList(oChat.oInfo[this.chatRoomNumber]["oParticipant"][this.userId]);
										}								
									},
									oResult: oResultFromWebServer,
									chatRoomNumber: chatRoomNumber,
									userId: getUserId()
								};
					
								executeAllClientInChattingRoom(chatRoomNumber, oCallbackForEveryOneInChatRoom);
								//채팅방 참여를 알린다.
								sendAdminMessageToChatRoomMembersExceptSender(chatRoomNumber, getUserNickname()+"님이 입장하였습니다.");					
								//***************************for everyone in SameChatRoom
								
								executeInClient(oCallback);
							});
						}		
					});//insert Query
					/********************************************************************************************************************/
				}		
			}
		});//Select Query
	});
	/********************************************************************************************************************/
	
	//Message 전송에 대해 Listening하고 있는 함수
	socket.on('message', function(oParameter) {
		sendMessageToChatRoomMembers( getUserId(), oParameter["chatRoomNumber"], oParameter["message"]);
	});
	
	// TODO 현재는 DB에서 사용자 정보를 삭제하는 작업만 된 상태. socket과의 connection을 끊는 부분의 구현이 필요하다.
	// 채팅방을 나가겠다는 요청을 처리한다.
	socket.on('exit', function(data) {
		requestQuery(
			"DELETE FROM tbl_chat_room_has_tbl_member WHERE tbl_chat_room_id = ? AND tbl_member_id = ?",
			[data.chatRoomNumber, getUserId()],
			function(oResult) {
				var affectedRows = oResult[affectedRows];
				console.log("oResult : ",oResult);
				
				if ( affectedRows === 0 ) {
					//TODO 에러별 클라이언트 처리
					console.log("Delete Fail");
				} else {					
					
					//***************************for user
					var oCallback = {
						callback: function() {
							oAside.deleteFromChattingList(this.chatRoomNumber);
							oChat.invisibleChatWindow();
						},
						chatRoomNumber: data.chatRoomNumber
					}
					
					executeInClient(oCallback);
					
					//***************************for user

					//***************************for everyone in SameChatRoom
					//채팅방의 모든사람들에게 퇴장메세지를 전달					
					sendAdminMessageToChatRoomMembers(data.chatRoomNumber, getUserNickname() + "님이 채팅방에서 퇴장하였습니다.");										
					
					//채팅방에서 나간 멤버를 각자의 참여자 정보리스트(oInfo)에서 제거한다.
					var oCallbackForEveryOneInChatRoom = {
						callback: function() {
							var oTarget = oChat.oInfo[this.chatRoomNumber]["oParticipant"][this.userId];
							
							//Beware that IE8 may throw an exception when using delete in certain circumstances
							//reference : http://stackoverflow.com/questions/1073414/deleting-a-window-property-in-ie
							try { 
								delete oTarget; 
							} catch(e) { 
								oTarget = undefined; 
							}
				
							//현재 focus된 채팅방이 열려있을 경우,
							if ( oChat.currentChatRoomNumber == this.chatRoomNumber ) {
								oChat.removeMemberList(oTarget);
							}
						},
						chatRoomNumber: data.chatRoomNumber,
						userId: getUserId()
					};
					
					executeAllClientInChattingRoom(data.chatRoomNumber, oCallbackForEveryOneInChatRoom);
					//***************************for everyone in SameChatRoom
				}
			}
		);
	});

	//Connection을 끊거나, 끊겼을경우
	//유저가 마지막으로 보고있던 채팅방의 fold_time을 업데이트시켜준다.
	//채팅창을 그냥 닫는경우가 발생할 수 있으므로, 창을 닫는 행위를 할경우
	//하단의 saveCurrentChatRoomNumber로 null값을 전달하고,
	//만약 세션에서 가져온 currentChatRoomNumber가 null일경우에는 fold_time을 업데이트 하지 않는다.
	socket.on('disconnect', function() {
		socket.get("currentChatRoomNumber", function(error, lastChatRoomNumber) {
			
			if (error) {
				console.log("save CurrentChatRoomNumber : ",e);
				return;
			}
			
			//유저가 창을 fold했거나, 채팅창을 열지 않았을 경우 즉시탈출한다.
			if (lastChatRoomNumber === null) {
				return;
			}
			
			var userId = getUserId();
			
			requestQuery(
				"UPDATE tbl_chat_room_has_tbl_member SET fold_time=NOW() WHERE tbl_chat_room_id=? AND tbl_member_id=?",
				[lastChatRoomNumber, userId],
				function(oResult) {
					console.log("Update Last Fold time, User id = ", userId);
				}
			)
		})
	});
	
	//현재 유저가 보고있는 채팅방의 번호를 세션에 저장해놓는다.
	//이는 그냥 창을 닫는 등의 경우가 발생할때 fold_time을 업데이트해주기 위해서이다.
	socket.on("saveCurrentChatRoomNumber", function(data) {
		socket.set("currentChatRoomNumber", data.currentChatRoomNumber);
	})
});



//***************************************************************************************
// Webserver와의 통신을 위한 http 관련 소스코드
//***************************************************************************************
var http = require('http');

function getOption() {

	options= {
  	  host: '125.209.195.202',
  	  path: 'url',
  	  port: '8080',
  	  method: 'GET',
	  headers: {
	              "accept": 'application/json'
			   }
	}
	
	return options;
}


function requestGet(url, oParameter, callback) {
	url += "?";
	
	for (var key in oParameter) {
		if (oParameter.hasOwnProperty(key)) {
			url+=key;
			url+="=";
			url+=oParameter[key]+"&";
		}
	}
	
	var option = getOption();
	option.path = url;
	
	var req = http.request(options, callback);
	req.end();
}

function getChatInfoFromWebServer(chatRoomNumber, pFunction) {
	console.log("into getChatInfoFromWebServer");
	var callback = function(response) {
		console.log("!!!!!!");
	  var sResult = '';
	  response.on('data', function (chunk) {
	    sResult += chunk;
	  });

	  response.on('end', function () {
	    console.log("sResult : :",sResult);
		pFunction(JSON.parse(sResult)[chatRoomNumber]);
	  })
	};
	
	requestGet("/chat/getMyChatInfo", {"chatRoomNumber": chatRoomNumber}, callback);
}
 
console.log('\u001b[0m');
