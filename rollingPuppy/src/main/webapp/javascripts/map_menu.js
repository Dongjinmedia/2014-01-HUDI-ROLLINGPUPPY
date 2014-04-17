/*
 * 맵에서 마커메뉴와의 인터렉션을 위한 js파일
 */

function initialize() {
	
	var socket = io.connect('http://127.0.0.1:3080');
	
	document.addEventListener("click", function(e) {
		e.preventDefault();
		
		if (e.target.className == "menu-item-back") {
			menuClick(e);
		}
		
		
		
	}, false);
}

/*
 * TODO 모든 메뉴에 대한 처리를 구별, 각각에게 알맞게 처리하도록 수정해야 한다.
 */
function menuClick(e) {
	
	/*
	 * 채팅방 메뉴 클릭시
	 */
	alert("채팅방으로 이동합니다.");
	var content = document.getElementById("content");
	var socket = io.connect('http://127.0.0.1:3080');
	
	/*
	 * TODO 하드코딩으로 추가하는 형태가 아닌, 미리 HTML에 채팅방소스를 구현해놓고, display값을 변경하면서 사용하는 식으로
	 */
	content.innerHTML = content.innerHTML + 
			"<div id='chat' style='display:block;'>" +
				"<div id='textarea'>" +
					"<dl id='txtappend'></dl>" +
				"</div><br/>" +
				"<input type='text' style='width: 255px;' id='txt' /><input type='button' value='Enter' id='btn'/>" +
			"</div>";
	
	/*
	 * 
	 */
	var chatSpace = document.getElementById("txtappend");
	var inputSpace = document.getElementById("txt");
	
	var nickname = document.getElementById("nickname").value;
	console.log(nickname);
	
	//입장을 서버에 알린다
	//TODO roomname 변경
	socket.emit('join', {'userid': nickname, 'roomNumber': 1});
	
	//메세지 전송버튼을 클릭할 시	
	document.getElementById("btn").addEventListener('click', function(e) {
		console.log("메세지 전송버튼 클릭");
		var message = inputSpace.value;
		
		console.log(message);
		socket.emit('message', nickname+ " : " + message);
	}, false);
	
	//새로 접속 한 사용자가 있을 경우 알림을 받는다.
	socket.on('join', function(user) {
		console.log(user);
		chatSpace.innserHTML = chatSpace.innerHTML + "<dd style='margin:0px;'>"+user+"님이 접속 하셨습니다.</dd>";
	});
	
	socket.on('message', function (message) {
		console.log("서버로부터 전송받은 메세지 : "+message)
		chatSpace.innerHTML = chatSpace.innerHTML + "<dd style='margin:0px;'>"+message+"</dd";
		inputSpace.innerHTML = "";
	});
}

initialize();