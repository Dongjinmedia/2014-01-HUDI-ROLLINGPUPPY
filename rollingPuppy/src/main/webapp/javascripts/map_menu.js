/*
 * 맵에서 마커메뉴와의 인터렉션을 위한 js파일
 */

//
//Custom Listener객체
var MarkerEventRegister = function () { 
	
	//마커 클릭액션시 나타나는 content, 메뉴바 등을 모두 포함하는 div
	//TODO 추후 아이디값으로 찾을 예정
	var controlBox = document.getElementById('controlBox');
	
	//사용자와 인터렉션하는 원형 메뉴바
  	var menu = controlBox.querySelector('#menu');
	
	//메뉴버튼 객체를 담을 Array
	var aIcons = [];
	
	//클릭된 메뉴가 있는지 확인하는 함수, boolean값을 리턴한다.
	var isClickedComponentExists = function() {
		for (var index = 0 ; index < aIcons.length ; ++index ) {
			var iconStatus = aIcons[index].getAttribute('status');
		
			if ( iconStatus === 'clicked') {
				return true;
			}
		}
		
		return false;
	};
	
	//메뉴버튼위에 마우스가 올라갔을때
	menu.addEventListener('mouseover', function() {
		//메뉴크기를 늘리면서 메뉴버튼들이 보인다. (애니메이션 효과가 css를 통해 자동으로 동작)
		menu.setAttribute('style', 'width:150px;height:150px;margin:-75px 0 0 -75px');			
	},false);	
	
	//메뉴버튼위에서 마우스가 빠져나갈때
	menu.addEventListener('mouseout', function() {
		//클릭된 메뉴가 없을경우
		if (!isClickedComponentExists()) {
			//메뉴크기를 줄어들면서 메뉴버튼들이 사라진다. (애니메이션 효과가 css를 통해 자동으로 동작)
			menu.setAttribute('style', 'width:75px;height:75px;margin:-37.5px 0 0 -37.5px');					
		}
	},false);
	
	//외부에서 addListener 함수를 통해서 새로적용되는 메뉴버튼과, 메뉴 컨텐츠영역을 전달받는다.
  	this.addListener = function (oIcon, oMenu) {
		
		aIcons.push(oIcon);
		
		oIcon.addEventListener('mouseover', function() {
			oMenu.style.display = 'block';
		},false);
  
		oIcon.addEventListener('mouseout', function() {
			var status = oIcon.getAttribute('status');
		
			if ( status != 'clicked')
				oMenu.style.display = 'none';
		},false);
	
		oIcon.addEventListener('click', function(e) {
		
			e.preventDefault();
		
			var status = oIcon.getAttribute('status');
			
			if (status === 'clicked') {
				oMenu.setAttribute('style','display: none');
				oMenu.style.display = 'none';
			
				oIcon.setAttribute('status','none');
				oIcon.style.status = 'none';
				oIcon.children[0].setAttribute('style', 'background: #8cc;');
				
				if (!isClickedComponentExists()) {
					menu.setAttribute('style', 'width:75px;height:75px;margin:-37.5px 0 0 -37.5px');		
				}
			} else if (status === 'none') {
				oIcon.setAttribute('status','clicked');
				oIcon.style.status = 'clicked';
				oIcon.children[0].setAttribute('style', 'background: #9dd;');
				menu.setAttribute('style', 'width:150px;height:150px;margin:-75px 0 0 -75px;');		
			}
		},false);	
  	}
}

//초기화 함수
function initialize() {
	
	var socket = io.connect('http://127.0.0.1:3080');
	
	document.addEventListener("click", function(e) {
		e.preventDefault();
		
		if (e.target.className == "menu-item-back") {
			menuClick(e);
		}
		
		
		
	}, false);
	
	//CUSTOM으로 만든 이벤트객체 생성
	var oEventRegister = new MarkerEventRegister();
	
	//마커를 감싸고 있는 최상위 DIV
	//TODO 현재는 테스트 버전이라서 className으로 찾지만, 나중에는 위치별 아이디를 부여한뒤,
	//getElementById로 가져오도록 수정해야 한다.
	var controlBox = document.getElementById('controlBox');
	
	//첫째줄, 마커클릭시 나타나는 3개의 메뉴중, 12시 방향에 나타나는 info에 해당하는 버튼
	//둘째줄, iconInfo버튼 상위에 미리 만들어 놓은 div, 내용을 보여주기 위한 영역
	//셋째줄, Custom Listener객체에 등록한다. (메뉴아이콘, 미리만들어 놓은 content div영역)
	var iconInfo = controlBox.querySelector('.icon-info');
	var menuInfo = controlBox.querySelector('.menu-info');
	oEventRegister.addListener(iconInfo, menuInfo);
	
	var iconChatting = controlBox.querySelector('.icon-chatting');
	var menuChatting = controlBox.querySelector('.menu-chatting');
	oEventRegister.addListener(iconChatting, menuChatting);	
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
	content.insertAdjacentHTML( 'beforeend',
			"<div id='chat' style='display:block;'>" +
				"<div id='textarea'>" +
					"<dl id='txtappend'></dl>" +
				"</div><br/>" +
				"<input type='text' style='width: 255px;' id='txt' /><input type='button' value='Enter' id='btn'/>" +
			"</div>");
	
	/*
	 * 
	 */
	var chatSpace = document.getElementById("txtappend");
	var inputSpace = document.getElementById("txt");
	
	var nickname = document.getElementById("nickname").value;
	
	//입장을 서버에 알린다
	//TODO roomname 변경
	socket.emit('join', {'userid': nickname, 'roomNumber': 1});
	
	//메세지 전송버튼을 클릭할 시	
	document.getElementById("btn").addEventListener('click', function(e) {
		var message = inputSpace.value;
		socket.emit('message', nickname+ " : " + message);
	}, false);
	
	//새로 접속 한 사용자가 있을 경우 알림을 받는다.
	socket.on('join', function(user) {
		chatSpace.insertAdjacentHTML( 'beforeend', "<dd style='margin:0px;'>"+user+"님이 접속 하셨습니다.</dd>");
	});
	
	socket.on('message', function (message) {
		chatSpace.insertAdjacentHTML( 'beforeend',"<dd style='margin:0px;'>"+message+"</dd");
		inputSpace.value="";
	});
}

initialize();