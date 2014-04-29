/*
 * Main.jsp에 대한 자바스크립트 소스코드. 초기화 함수는 최하단에 있습니다.
 */

/*********************************************************************************************************
 * 모두에게 공통되는 유틸함수 영역
*********************************************************************************************************/

var mapAPIkeyRealServe = "5c935084c09a23e331aee090a0f2270c";

//TODO Util함수 모듈화
//특정 node의 style을 반환하는 함수
function getStyle(node, style) {
    return window.getComputedStyle(node, null).getPropertyValue(style);
}

//document의 특정 노드를 가져오는 함수
function getNode(node) {
    return document.getElementById(node);
}

//Ajax 통신을 담당하는 모듈 Object
var oAjax = {
		//Ajax 결과값을 담아두는 Object
		oAjaxResult: null,
		
		//Ajax GET 요청함수
		//내부적으로 _getObjectFromJsonRequest 호출
		getObjectFromJsonGetRequest: function (url, oParameters) {
			this._getObjectFromJsonRequest(url, "GET", oParameters, this.callback);
			return this.oAjaxResult;
		},
		
		//Ajax POST 요청함수
		//내부적으로 _getObjectFromJsonRequest 호출
		getObjectFromJsonPostRequest: function (url, oParameters) {
			this._getObjectFromJsonRequest(url, "POST", oParameters, this.callback);
			return this.oAjaxResult;
		},
		
		//서버통신이후에 Ajax 객체를 this에 bind해서 전달한다.
		//메서드의 this는 XHR객체를 의미한다.
		//TODO 안좋은 방법같은데 조금 더 리서치를 해보자..
		callback: function() {
			console.log(this.responseText);
			window.oAjax.oAjaxResult =  JSON.parse(this.responseText);
		},
		
		//Ajax 요청함수
		//TODO CROSS BROWSER 시 하위링크 참조 
		//http://stackoverflow.com/questions/8286934/post-formdata-via-xmlhttprequest-object-in-js-cross-browser
		
		//Object의 key, value형태의 데이터가 파라미터로 전달되면, 해당 데이터를
		//formData 형태로 만들어 서버에 요청보낸다.
		_getObjectFromJsonRequest: function(url, method, oParameters, callback) {
			var request = new XMLHttpRequest();
			
			//요청 메서드가 get이나 post가 아닐경우, 잘못된 요청이다.
			if (method !== "GET" && method !== "POST" )
				return null;
			
			request.open(method, url, false	);
			
			request.onreadystatechange = function() {
				console.log("readyState : ", request.readyState);
				console.log("status : ", request.status);
				
				if (request.readyState == 4 && request.status == 200) {
					var obj = JSON.parse(request.responseText);
					
					//인자로 전달된 callback함수를 bind, 실행
					if ( typeof callback == "function" ) {
						callback.apply(request);
					}
				}
			}
			
			
			//만약 parameter값이 존재할경우 parameter에 대한 데이터를  formData형식으로 캡슐화해서 전달한다.
			//Object.keys(obj).length === 0;  <-  ECMAScript 5 support is available
			if ( oParameters !== null && Object.keys(oParameters).length !== 0 ) {
				
				var formData = new FormData();
				
				//hasOwnProperty is used to check if your target really have that property, 
				//rather than have it inherited from its prototype. A bit simplier would be
				for (var key in oParameters){
					
				    if (oParameters.hasOwnProperty(key)) {
				         //alert("Key is " + key + ", va	lue is" + oParameters[key]);
				    	console.log("key : ", key);
				    	console.log("value : ", oParameters[key]);
				    	formData.append(key, oParameters[key]);
				    }
				}
				console.log("formData : ", formData);
				request.send(formData);
				
			//parameter값이 존재하지 않으면 그냥 request를 보낸다.
			} else {
				request.send();
			}
		}
}


/*********************************************************************************************************
 * 경민이가 작성한 네비게이션관련 소스코드 시작
 **********************************************************************************************************/
//main.jsp의 div#aside > div#panel의 folding animation을 위한 객체
var Panel = {
	// div#container와 div#panel를 찾아서 기억합니다.
	elContainer: document.getElementById('container'),
	elPanel: document.getElementById('panel'),
	
	// panel 관련 이벱트 등록 함수.
	addEvents: function() {
		var elButtons = this.elPanel.querySelectorAll('a');
		
		// panel 밑에 button 이벤트 등록.
		// 향후 event delegation 방식으로 변경할 것.
		for (var idx = 0; idx < elButtons.length; idx++) {
			elButtons[idx].addEventListener(
					'click',
					this.fnPanelButtonHandler.bind(this)
			);
		}
	},
	
	// panel 접기 버튼에 발생하는 click이벤트 콜백함수  
	fnPanelButtonHandler: function(event) {
		event.preventDefault();

		var strButtonClassName = event.target.className;

		var boolFold = false;
		if (strButtonClassName === 'panel_button_fold') {
			boolFold = true;
		}
		
		if (boolFold) {
			this.elContainer.className = 'fold_panel';
		} else {
			this.elContainer.className = 'unfold_panel';
		}
	}
}

var NavList = {
	elNavList: document.getElementById('nav_list'),
	
	addEvents: function() {
		this.elNavList.addEventListener(
				'click',
				function(event) {
					console.log(event.target);
					// 라이브러리 만들거나 util함수로 만들어서 다중 className 문제 처리할 것 
					if (event.target && event.target.className == "search") {
						
					} else if(event.target && event.target.className == "recommendation") {
						
					} else if(event.target && event.target.className == "chatting") {
						
					} else if(event.target && event.target.className == "bookmark") {
						
					} else if(event.target && event.target.className == "setting") {
						
					} else {
						return ;
					}
				}
		);
	}
}

/*********************************************************************************************************
 * 네비게이션관련 소스코드 끝
 **********************************************************************************************************/

/*********************************************************************************************************
 * 소은이가 작성한 네이버맵 API관련 소스코드 시작
 **********************************************************************************************************/
var naverMapSettings = {
		naverMap: null, //Main Page에서 Map영역에 해당하는  div객체
	    oCenterPoint: null, //지도 중심으로 포커싱할 위치를 저장하는 객체 (LatLng 좌표사용)
	    oMap: null, //맵옵션을 모두 저장하고 있는 지도의 기본이 되는 객체
	    oIcon: null,
	    oMarkerInfoWindow: null,
	    oLabel: null,

	    //Zoom 조절을 위한 함수
	    changeZoom: function(nZoomLevel) {
	        this.oCenterPoint = this.oMap.getCenter();

	        //change zoom method
	        this.oMap.setPointLevel(this.oCenterPoint, nZoomLevel);
	    },

	    // 원하는 동작을 구현한 이벤트 핸들러를 attach함수로 추가.
	    // void attach( String sEvent, Function eventHandler) 이벤트명,  이벤트 핸들러 함수
	    attachEvents : function(){
	        this.oMarkerInfoWindow.attach("changeVisible", this.changeVisibleEvent.bind(this)); 
	        this.oMap.attach("mouseenter", this.mouseEnterEvent.bind(this)); // mouseenter: 해당 객체 위에 마우스 포인터를 올림
	        this.oMap.attach("mouseleave", this.mouseLeaveEvent.bind(this)); //mouseleave : 마우스 포인터가 해당 객체 위를 벗어남
	        this.oMap.attach("dragstart",this.dragStartEvent.bind(this));
	        this.oMap.attach("click",this.clickEvent.bind(this));    
	    },

	    //changeVisible : event. 정보창의 표시여부 변경
	    //changeVisible {visible : Boolean} 요렇게 생김
	    //oMarkerInfoWindow에다가 changeVisible이라는 이벤트를 거는데, 이 이벤트가 걸리면 뭘 하냐면, 
	    changeVisibleEvent : function(oCustomEvent){
	        if (oCustomEvent.visible) { //이벤트의 visible값이 true이면
	            this.oLabel.setVisible(false); //라벨(마우스를 마커위에 클릭하지 않은채 올렸을때 나오는 창)은 가림
	        }
	    },
	    
	    mouseEnterEvent: function(oCustomEvent) { 
	        var oTarget = oCustomEvent.target; //target : 모든 이벤트에 존재하는 프로퍼티로, 해당 이벤트를 발생시킨 객체를 의미
	        // 마커위에 마우스 올라간거면
	        if (oTarget instanceof nhn.api.map.Marker) {
	            var oMarker = oTarget;
	            this.oLabel.setVisible(true, oMarker); // - 특정 마커를 지정하여 해당 마커의 title을 보여준다.
	        }
	    },
	    mouseLeaveEvent : function(oCustomEvent) { 
	        var oTarget = oCustomEvent.target; //http://developer.naver.com/wiki/pages/JavaScript#section-JavaScript-Nhn.api.map.CustomControl의 public properties 부분 참조
	        // 마커위에서 마우스 나간거면
	        if (oTarget instanceof nhn.api.map.Marker) {
	            this.oLabel.setVisible(false);
	        }
	    },
	    
	    //move event가 발생한 후 click이벤트가 발생한다.
	    //drag 시작할 때 mapClickWithoutMarker를 화면상에서 보이지 않게끔 처리한다.
	    dragStartEvent : function(oCustomEvent){
	        oMapClicker.invisible();
	    },

	    clickEvent : function(oCustomEvent) {
	        var oTarget = oCustomEvent.target;
	        this.oMarkerInfoWindow.setVisible(false);
	        // 마커 클릭하면
	        if (oTarget instanceof nhn.api.map.Marker) {
	            // 겹침 마커 클릭한거면
	            if (!oCustomEvent.clickCoveredMarker) {
	                //최초에 생성해놓은 클릭 객체메뉴를 가져온다.
	                var menuTemplate = document.getElementById("controlBox");

	                // - InfoWindow 에 들어갈 내용은 setContent 로 자유롭게 넣을 수 있습니다. 외부 css를 이용할 수 있으며, 
	                // - 외부 css에 선언된 class를 이용하면 해당 class의 스타일을 바로 적용할 수 있습니다.
	                // - 단, DIV 의 position style 은 absolute 가 되면 안되며, 
	                // - absolute 의 경우 autoPosition 이 동작하지 않습니다. 
	                this.oMarkerInfoWindow.setContent(menuTemplate); //여기가 info window의 html코드를 넣는 부분
	                this.oMarkerInfoWindow.setPoint(oTarget.getPoint());
	                this.oMarkerInfoWindow.setVisible(true);
	                this.oMarkerInfoWindow.setPosition({ //지도 상에서 정보창을 표시할 위치를 설정 
	                    right: 0,
	                    top: -19
	                });

	                //TODO getPosition 결과값을 읽어서 적절히 autoPosition(value값)으로 이동시키도록 한다.
	                //oMarkerInfoWindow.autoPosition(); //정보 창의 일부 또는 전체가 지도 밖에 있으면, 정보 창 전체가 보이도록 자동으로 지도를 이동 
	            }
	        } else {
	            
	                //클라이언트에 상대적인 수평, 수직좌표 가져오기
	                clientPosX = oCustomEvent.event._event.clientX;
	                clientPosY = oCustomEvent.event._event.clientY;
	                
	              //전역으로 정의된 oMapClicker 객체에 이벤트가 시작된 (클릭된) 좌표에 대한 Point객체를 이식.
	                oMapClicker.oClickPoint = oCustomEvent.point;
	                oMapClicker.move(clientPosX, clientPosY);
	        }
	    },

	    initialize: function() {
	        this.naverMap = getNode("naver_map");
	        var mapDivWidth = getStyle(this.naverMap, "width");
	        var mapDivHeight = getStyle(this.naverMap, "height");
	        this.oCenterPoint = new nhn.api.map.LatLng(37.5010226, 127.0396037);

	        nhn.api.map.setDefaultPoint("LatLng"); //지도의 설정 값을 조회하는 메서드나 이벤트가 사용하는 좌표 객체의 디폴트 클래스를 설정

	        this.oMap = new nhn.api.map.Map(this.naverMap, {
	            point: this.oCenterPoint, //지도 중심점의 좌표 설정
	            zoom: 10, //초기 줌 레벨은 10으로 둔다.
	            enableWheelZoom: false, //마우스 휠 동작으로 지도를 확대/축소할지 여부
	            detectCoveredMarker: true, //겹쳐 있는 마커를 클릭했을 때 겹친 마커 목록 표시 여부
	            enableDragPan: true,             //마우스로 끌어서 지도를 이동할지 여부
	            enableDblClickZoom: false,             //더블클릭으로 지도를 확대할지 여부
	            mapMode: 0, //지도 모드(0 : 일반 지도, 1 : 겹침 지도, 2 : 위성 지도)
	            activateTrafficMap: false, //실시간 교통 활성화 여부
	            activateBicycleMap: false, //자전거 지도 활성화 여부
	            minMaxLevel: [1, 14], //지도의 최소/최대 축척 레벨
	            size: new nhn.api.map.Size(mapDivWidth, mapDivHeight) //지도의 크기
	        });

	        var oSize = new nhn.api.map.Size(28, 37); //px단위의 size객체.
	        
	        var oOffset = new nhn.api.map.Size(14, 37); //offset위치 지정
	        this.oIcon = new nhn.api.map.Icon("/images/marker_48.png", oSize, oOffset); //마커 설정 정보
	        this.oMarkerInfoWindow = new nhn.api.map.InfoWindow(); // - 마커를 클릭했을 때 뜨는 창. html코드뿐만 아니라 객체도 삽입 가능
	        
	        this.oMarkerInfoWindow.setVisible(false);   // - infowindow 표시 여부 지정
	                                                    //여기서는 true로 바꿔도 아무 변화가 없음  
	        this.oMap.addOverlay(this.oMarkerInfoWindow); // - 지도에 추가
	        this.oLabel = new nhn.api.map.MarkerLabel(); // 마커 위에 마우스 포인터를 올리면 나타나는 마커 라벨
	        this.oMap.addOverlay(this.oLabel); // - 마커 라벨 지도에 추가. 기본은 라벨이 보이지 않는 상태로 추가됨.

	         //네이버에서 자동으로 생성하는 지도 맵  element의 크기자동조절을 위해 %값으로 변경한다. (naver_map하위에 생긴다)
	        var eNmap = document.getElementsByClassName("nmap")[0];
	        eNmap.setAttribute("style", "width:100%;height:100%;");
	        
	        //setSize를 이용해서 변경을 하면 화면이 전부 날아가는 현상이 발생함..
	        //this.oMap.setSize(new nhn.api.map.Size(this.mapDivWidth, this.mapDivHeight));
	    }
};

/*********************************************************************************************************
 * 네이버맵 API관련 소스코드 끝
 **********************************************************************************************************/


/*********************************************************************************************************
 * 윤성이가 작성한 Marker Interaction 메뉴 소스코드 시작
 **********************************************************************************************************/
//Custom Listener객체
var MarkerEventRegister = function () { 
	
	//마커 클릭액션시 나타나는 content, 메뉴바 등을 모두 포함하는 div
	//TODO 추후 아이디값으로 찾을 예정
	var controlBox = document.getElementById("controlBox");
	
	//사용자와 인터렉션하는 원형 메뉴바
  	var menu = controlBox.querySelector("#menu");
	
	//메뉴버튼 객체를 담을 Array
	var aIcons = [];
	
	//클릭된 메뉴가 있는지 확인하는 함수, boolean값을 리턴한다.
	var isClickedComponentExists = function() {
		for (var index = 0 ; index < aIcons.length ; ++index ) {
			var iconStatus = aIcons[index].getAttribute("status");
		
			if ( iconStatus === "clicked") {
				return true;
			}
		}
		
		return false;
	};
	
	//메뉴버튼위에 마우스가 올라갔을때
	menu.addEventListener("mouseover", function() {
		//메뉴크기를 늘리면서 메뉴버튼들이 보인다. (애니메이션 효과가 css를 통해 자동으로 동작)
		menu.setAttribute("style", "width:150px;height:150px;margin:-75px 0 0 -75px");			
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

/*********************************************************************************************************
 * Marker Interaction 메뉴에 대한 소스코드 끝
 **********************************************************************************************************/

/*********************************************************************************************************
 * Create Chat Room 채팅방 생성에 대한 Hidden Area에 대한 소스코드 시작
 **********************************************************************************************************/
var oCreateChattingRoom = {
		//채팅방 생성에 해당하는 중앙창에 대한 element
		oCreateChattingRoom: null,
		//채팅방명을 입력하는 input box element
		eRoomNameInput: null,
		//채팅방 참여인원 제한 수를 입력하는 input box element
		eLimitNumberInput: null,
		//채팅방 생성창을 보일고, 다른메뉴와의 인터렉션을 막는 함수
		visible: function() {
			this.oCreateChatRoom.setAttribute('style', 'display:block;');
		},
		//채팅방 생성창을 닫고, 다른메뉴와의 인터렉션을 할 수 있도록 해주는 함수
		invisible: function() {
			this.oCreateChatRoom.setAttribute('style', 'display:none;');
		},
		initialize: function() {
			
			//element초기화
			this.oCreateChatRoom = document.getElementById('createChatRoom');
			this.eRoomNameInput = this.oCreateChatRoom.querySelector('.roomName');
			this.eLimitNumberInput = this.oCreateChatRoom.querySelector('.limitNum');
			var eOuterBg = this.oCreateChatRoom.querySelector('.outer.bg');
			
			//중앙 입력영역을 제외한 곳을 클릭하면 focus off 하는 이벤트
			eOuterBg.addEventListener('click', function() {
				this.invisible();
			}.bind(this), false);
			
			//채팅방 생성요청에 대한 action 이벤트
			var eSubmit = this.oCreateChatRoom.querySelector('input[type=submit]');
			eSubmit.addEventListener('click', this.requestCreate.bind(this), false);
		},
		//제한숫자 인풋값 초기화
		clearLimitNumValue: function() {
			this.eLimitNumberInput.value = "";
		},
		//채팅방명 인풋값 초기화
		clearRoomNameValue: function() {
			this.eLimitNumberInput.value = "";
		},
		//채팅방 생성에 대한 요청이벤트 함수
		requestCreate: function(e) {
			e.preventDefault();
			
			//Validation Check를 위한 form의 데이터가져오기
			var roomNameValue = this.eRoomNameInput.value
			var limitNumValue = parseInt(this.eLimitNumberInput.value);
			
			//숫자가 아닌값일 경우, value값이 넘어오지 않음
			//TODO keydown event를 통해서 아에 입력조차 되지 않도록 변경해야 한다.

			//입력값이 없을경우
			if ( roomNameValue === null || roomNameValue === "") {
				alert('채팅방 제목을 입력해 주세요.');
				return;
			} else if ( roomNameValue.length <= 4 ) {
				alert('채팅방 제목은 5글자 이상 입력되어야 합니다.');
				return;
			};
			
			//참여인원 제한에 입력값이 숫자 형식이 아닐경우
			if ( isNaN( limitNumValue ) ) {
				alert("인원수 제한에는 숫자값을 입력해 주세요.");
				this.clearLimitNumValue();
				return;
			};
			
			//참여인원 제한숫자가 1일경우
			if ( limitNumValue === 1 ) {
				alert("인원수는 1 이상으로 설정해야 합니다.");
				this.clearLimitNumValue();
				return;
			}
			
			//서버와 통신하는 코드
			var oRequestData = {
					"title": roomNameValue,
					"max": ""+limitNumValue,
					//TODO 검색기능 구현전까지의 Temp Data 가져오기. 
					//검색기능 구현 이후, 검색 object에 질의하는 형태로 변경되어야 한다. 
					"locationName": document.querySelector(".createAddress").innerText,
					"locationLatitude": oMapClicker.oClickPoint['y'],
					"locationLongitude": oMapClicker.oClickPoint['x']
			};
			
			//oAjax모듈에게 request요청을 보내고, response 데이터를 Object형태로 가져온다.
			var oResponseData = oAjax.getObjectFromJsonPostRequest("/chat/create", oRequestData);
			console.log("Create Room Response From Server : ",oResponseData);
			
			
			//TODO 마커에 고유 아이디값을 부여
			
			//마커를 생성
			console.log(oMapClicker.oClickPoint);
	    	var oMarker = new nhn.api.map.Marker(naverMapSettings.oIcon, {
	    	    title: 'test' + oMapClicker.oClickPoint.toString()
	    	});
	    	oMarker.setPoint(oMapClicker.oClickPoint);
	    	naverMapSettings.oMap.addOverlay(oMarker);
	    	
	    	//현재 화면에 있는  oMapClicker Element를 보이지 않게 한다.
	    	oMapClicker.invisible();
	    	
	    	//createChatRoom의 input value값들을 초기화한다.
	    	this.clearRoomNameValue();
	    	this.clearLimitNumValue();
	    	
	    	//현재 포커싱된 createChatRoom  Area를 보이지 않게 한다.
	    	this.invisible();
		}
}

/*********************************************************************************************************
 * Create Chat Room 채팅방 생성에 대한 Hidden Area에 대한 소스코드 종료
 **********************************************************************************************************/

/*********************************************************************************************************
 * Marker가 없는 Map클릭시 사용자와 Interaction해야 하는 메뉴에 대한 소스코드 시작
 **********************************************************************************************************/
//TODO naverMap Object에 이식하기
var oMapClicker = {
	//MapClickerk 전체 Element. 
	//TODO 변수명 변경
	oMapClicker: null,
	//Add버튼에 해당하는 Element.
	//TODO 변수명 변경
	clickAdd: null,
	//즐겨찾기 버튼에 해당하는 Element.
	//TODO 변수명 변경
	clickBookMark: null,
	//naverMap에서 클릭된 지점에 대한 Point Object를 저장하는 변수.
	oClickPoint: null,
	//Client width, height값을 계산해서 위치를 변경한다.
	move: function(clientPosX, clientPosY) {
		this.oMapClicker.style.left = clientPosX+'px';
		this.oMapClicker.style.top = clientPosY +'px';
	},
	//click element가 보이지 않도록 하는 함수
	invisible: function() {
		this.oMapClicker.style.top = "-2000px";
	},
	//click element 초기화 함수
	initialize: function() {
		//마커가 없는 메뉴지역을 클릭했을때 인터렉션을 위한 이벤트초기화
		this.oMapClicker = document.getElementById('mapClicker');
		this.clickAdd = this.oMapClicker.querySelector('.icon-add');
		this.clickBookMark = this.oMapClicker.querySelector('.icon-star');
		
		//mapClicker 메뉴중, plus 버튼을 클릭했을때
		this.clickAdd.addEventListener('click', function(e) {
			oCreateChattingRoom.visible();
		}, false);
		
		//mapClicker 메뉴중, star 버튼을 클릭했을때
		this.clickBookMark.addEventListener('click', function(e) {
			alert('clickBookMark');
			
		}, false);
	},	
};
/*********************************************************************************************************
 * Marker가 없는 Map클릭시 사용자와 Interaction해야 하는 메뉴에 대한 소스코드 종료
 **********************************************************************************************************/

/*********************************************************************************************************
 * 모두에게 공통되는 초기화 함수영역
 **********************************************************************************************************/
function initialize() {
	
	/*
	 * 현재 경민이 작업중
	 */
	//------------------------------------------------------------------------------------//
	//네비게이션 초기화영역
	Panel.addEvents();
	NavList.addEvents();	
	//------------------------------------------------------------------------------------//
	
	/*
	 * 현재 소은이 작업중
	 */
	//------------------------------------------------------------------------------------//
	//네이버맵 초기화영역
	naverMapSettings.initialize();
	naverMapSettings.attachEvents();
	//------------------------------------------------------------------------------------//
	
	
	/*
	 * 현재 윤성이 작업중
	 */
	//------------------------------------------------------------------------------------//
	//Marker Interaction 메뉴 초기화영역
	
	//Marker Interaction 메뉴 초기화
	//CUSTOM으로 만든 이벤트객체 생성
	//TODO 한번만 호출되기 떄문에 object로 변경, 하위의 메소드들도 initialize 함수안에서 진행하도록 변경
	var oEventRegister = new MarkerEventRegister();
	
	//마커를 감싸고 있는 최상위 DIV
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
	//------------------------------------------------------------------------------------//
	
	
	/*
	 * 현재 윤성이 작업중
	 */
	//------------------------------------------------------------------------------------//
	//MapClicker(마커가 없는 메뉴지역)을 클릭했을때 인터렉션을 위한 객체 초기화
	oMapClicker.initialize();
	//------------------------------------------------------------------------------------//
	
	/*
	 * 현재 윤성이 작업중
	 */
	//------------------------------------------------------------------------------------//
	//Chatting Room Create Area를 위한 초기화 영역
	oCreateChattingRoom.initialize();
	//------------------------------------------------------------------------------------//
	
	/*
	 * 현재 윤성이 작업중
	 */
	//------------------------------------------------------------------------------------//
	//Chatting을 위한  socket.io 초기화 영역
	var socket = io.connect('http://127.0.0.1:3080');
	document.addEventListener("click", function(e) {
		e.preventDefault();
		
		if (e.target.className == "menu-item-back") {
			menuClick(e);
		}
	}, false);
	//------------------------------------------------------------------------------------//
}

window.onload = initialize();
