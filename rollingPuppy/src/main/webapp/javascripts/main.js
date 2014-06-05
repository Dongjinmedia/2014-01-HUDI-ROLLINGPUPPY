/*
 * Main.jsp에 대한 자바스크립트 소스코드. 초기화 함수는 최하단에 있습니다.
 */

/*********************************************************************************************************
 * 모두에게 공통되는 유틸함수 영역
*********************************************************************************************************/
//temp key variable.
var mapAPIkeyRealServer = "5c935084c09a23e331aee090a0f2270c";

//TODO Util함수 모듈화
//특정 node의 style을 반환하는 함수
function getStyle(node, style) {
    return window.getComputedStyle(node, null).getPropertyValue(style);
}

//document의 특정 노드를 가져오는 함수
function getNode(node) {
    return document.getElementById(node);
}

//Node에 className를 추가하는 함수
function addClassName(node, strClassName) {
	// 기존에 className가 없던 경우
	if (node.className === "") {
		node.className = strClassName;
		return ;
	}
	
	// 기존에 className가 있는 경우 공백문자를 추가하여 넣어줍니다
	node.className += " " + strClassName;
}

//Node에 특정 className을 제거하는 함수
function removeClassName(node, strClassName) {
	// 기존에 className가 없는 경우 함수를 종료합니다
	if (node.className === "") {
		return ;
	}
	
	// node에 className이 존재하고, target className 하나만 있는 경우
	if (node.className.length === strClassName.length) {
		node.className = "";
		return ;
	}
	
	// node에 className가 다수 존재하는 경우의 target className 삭제
	// node.className에 replace 결과물을 대입합니다.
	node.className = node.className.replace(" " + strClassName, "").toString();
}

/*********************************************************************************************************
 * 네비게이션관련 소스코드 시작
 **********************************************************************************************************/
//main.jsp의 div#aside > div#panel의 folding animation을 위한 객체
var oAside= {
	// div#container와 div#panel를 찾아서 기억합니다.
	eContainer: document.getElementById("container"),
	ePanel: null,
	
	//nav_list 관련 기능들을 모아둔 변수
	eNavList: document.getElementById("nav_list"),
	// 마지막 클릭된 nav_list 메뉴와 해당하는 panel_contents를 기억해둡니다.
	// 기본값은 search로 되어 있습니다.
	eLatestClickedMenu: document.querySelector("#nav_list>.on"),
	eLatestPanelContents: document.querySelector("#panel_contents>.on"),
	eSearchMenu: document.querySelector("#nav_list .search"),
	eRecommendMenu: document.querySelector("#nav_list .recommendation"),
	eBookmarkMenu: document.querySelector("#nav_list .bookmark"),
	eSettingMenu: document.querySelector("#nav_list .settings"),

	//채팅방 패널관련
	eChattingMenu: document.querySelector("#nav_list .chatting"),
	eChattingNotification: document.querySelector("#nav_list .notification"),
	eChattingTemplate: document.querySelector("#template .chatRoom"),
	eChattingListTarget: document.querySelector("#pc_chatting ul"),

	
	commingSoon: function(event) {
		event.preventDefault();
		alert("Comming Soon~\n준비중인 메뉴입니다.^^");
	},
	
	// panel및 nav 관련 이벤트 등록 함수.
	addEvents: function() {
		var ePanelButtons = this.ePanel.querySelector("#panel_buttons");
		
		// panel_buttons 아래 있는 두 개의 button에 대한 클릭 이벤트를 받는다.
		ePanelButtons.addEventListener(
				"click",
				this.fnPanelButtonsHandler.bind(this)
		);
		
		//Navigation영역의 버튼에 이벤트를 할당한다.
		this.eSearchMenu.addEventListener("click", this.clickSearchMenu.bind(this));
		this.eChattingMenu.addEventListener("click", this.clickChattingMenu.bind(this));
		this.eRecommendMenu.addEventListener("click", this.commingSoon.bind(this));
		this.eBookmarkMenu.addEventListener("click", this.commingSoon.bind(this));
		this.eSettingMenu.addEventListener("click", this.commingSoon.bind(this));
		
		//검색 결과를 클릭 이벤트에 대한 핸들러 붙이기
		var eSearchPanelContents = this.ePanel.querySelector("#pc_search");
		eSearchPanelContents.addEventListener("click", this.searchResultSelectHandler.bind(this));
		
		var eChattingPanelContents = this.ePanel.querySelector("#pc_chatting");
		eChattingPanelContents.addEventListener("click", this.chattingSelectHandler.bind(this));
	},
	//읽지 않은 메세지갯수 뷰를 업데이트한다.
	updateTotalNotificationView: function() {
		var unreadMessageNum = 0;
		for (var key in oChat.oInfo) {
			if (oChat.oInfo.hasOwnProperty(key)) {
				var oTarget = oChat.oInfo[key];
				
				unreadMessageNum += parseInt(oTarget["unreadMessageNum"]);
			}
		}
		
		if ( unreadMessageNum === 0 || this.eChattingMenu.parentNode.className == "on") {
			this.eChattingNotification.style.display = "none";
		} else {
			this.eChattingNotification.innerText = unreadMessageNum;
			this.eChattingNotification.style.display = "inline-block";
		}
	},
	
	vacantChattingList: function() {
		var eDefaultTemplate = document.getElementById("template").querySelector(".default");			
		var eTarget = document.getElementById("pc_chatting").querySelector("ul");

		//이미 존재하는 채팅방 목록이 있면 지운다.
		while (eTarget.firstChild) {
			eTarget.removeChild(eTarget.firstChild);
		}
		
		var eCopiedDefaultTemplate = eDefaultTemplate.cloneNode(true);
		eCopiedDefaultTemplate.querySelector(".comment").innerText = "채팅 중인 채팅방이 없습니다.";
		//template을 원하는 위치에 삽입
		eTarget.appendChild(eCopiedDefaultTemplate);
	},
	
	addChattingList: function(chatRoomNumber, oTarget) {
		//TODO 변수삭제. 하단부 참조항목들 변경
		var eTemplate = this.eChattingTemplate;
		var eTarget = this.eChattingListTarget;
		
		var eCopiedTemplate = eTemplate.cloneNode(true);
		var eChattingRoomTitle = eCopiedTemplate.querySelector(".title");
		var eChattingRoomMax = eCopiedTemplate.querySelector(".limit");
		var eChattingRoomAddress = eCopiedTemplate.querySelector(".address");
		var eChattingRoomNotification = eCopiedTemplate.querySelector(".notification");
		
//		"채팅방번호": {
//			title: "",
//			locationName: "", 
//			max: "",
//			participantNum: "",
//			unreadMessageNum: "", 
//			oParticipant: {
//				"회원아이디": 
//				{
//					nickname: "",
//					TODO 추가데이터
//				}
//			}
//		}
		
		//어차피 oChat의 oInfo에서는 자신에 해당하는 List Element를 자주참조하게된다.
		//그러므로 li element의 주소값을 attribute로 등록한다.
		oChat.oInfo[chatRoomNumber]["eTarget"] = eCopiedTemplate;
		console.log("oChat.oInfo : ",oChat.oInfo);
		//클릭시 이벤트를 처리할 수 있도록 chatRoomNum을 Attribute로 등록한다.
		eCopiedTemplate["chatRoomNumber"] = chatRoomNumber;
		
		eChattingRoomTitle.innerHTML = oTarget["title"]; 
		eChattingRoomMax.innerText = oTarget["participantNum"] +"/"+ oTarget["max"]; 
		eChattingRoomAddress.innerText = oTarget["locationName"];
		oChat.updateNotificationView(chatRoomNumber);
		
		
		//template을 원하는 위치에 삽입
		eTarget.appendChild(eCopiedTemplate);
	},
	//working2
	deleteFromChattingList: function(chatRoomNumber) {
		var eTarget = oChat.oInfo[chatRoomNumber]["eTarget"];
		this.eChattingListTarget.removeChild(eTarget);
		
		if ( this.eChattingListTarget.childNodes.length === 0 ) {
			this.vacantChattingList();
		}
	},
	// panel 접기 버튼에 발생하는 click이벤트 콜백함수  
	// CSS3 animation은 CSS 속성으로 동작합니다.
	// 따라서 .fold_panel과 .unfold_panel에 animation 속성이 들어가 있습니다.
	fnPanelButtonsHandler: function(event) {
		event.preventDefault();

		// panel_button에서 발생한 click 이벤트를 받고, 해당
		var strButtonClassName = event.target.className;

		// panel_buttons 중 어느 것이 클릭되었는지 판단해서 true / false로 저장
		var boolFold = false;
		// 등호가 세 개이면 type check까지 됨 (2개의 경우 "2" == 2 가 true)
		if (strButtonClassName === "panel_button_fold") {
			boolFold = true;
		}
		
		// boolFold == true 면 fold_panel 실행
		// boolFold == false 면 unfold_panel 실행
		if (boolFold) {
			this._foldPanelContents();
		} else {
			this._unfoldPanelContents();
		}
	},
	
	_unfoldPanelContents: function() {
		// panel_button에서 발생한 click 이벤트를 받고, 해당
		this.eContainer.className = "";
		addClassName(this.eContainer, "unfold_panel");
	},
	
	_foldPanelContents: function() {
		this.eContainer.className = "";
		addClassName(this.eContainer, "fold_panel");
	},
	
	clickSearchMenu: function(event) {
		if ( event !== undefined )
			event.preventDefault();
		
		this.unfoldByMenuElement(this.eSearchMenu);
	},
	
	clickChattingMenu: function(event) {
		if ( event !== undefined )
			event.preventDefault();
		
		//채팅방 Notification을 보이지 않도록 처리
		this.eChattingNotification.style.display = "none";
		
		this.unfoldByMenuElement(this.eChattingMenu);
	},
	
	//채팅리스트중 하나의 cell을 선택했을 때 실행되는 콜백함수
	//working
	chattingSelectHandler: function(event) {
		var clickedTarget = event.target;	
		if(clickedTarget.tagName == "P"){
			//cell을 선택했으면 
			//현재, cell의 속성으로 좌표를 넣어두었다. 따라서 태그의 부모노드인 cell을 찾아서 
			//그 cell의 속성으로 저장된 채팅방번호를 가져온다.
			var destinationTarget = clickedTarget.parentNode;
			var chatRoomNum = destinationTarget["chatRoomNumber"];
			
			oChat.showChatWindow(chatRoomNum);
			this._foldPanelContents();
		}
	},
	
	//검색 결과 중 하나의 cell을 선택했을 때 실행되는 콜백함수 
	searchResultSelectHandler: function(event){
		if (this.ePanel.querySelector("#pc_search .comment")) {
			return;
		}
		
		var clickedTarget = event.target;
		//현재 하나의 cell은 세개의 p태그로 이루어져있다.
		//그런데, cell이외의 page부분은 li태그로 이루어져있으므로 p태그인지 아닌지를 확인하는것이 cell을 선택했는지 여부의 척도가 될 수 있다.
		if(clickedTarget.tagName == "P"){
			//cell을 선택했으면 
			//현재, cell의 속성으로 좌표를 넣어두었다. 따라서 태그의 부모노드인 cell을 찾아서 
			//그 cell의 속성으로 저장된 좌표를 불러온다. 
			var destinationTarget = clickedTarget.parentNode;
			var destinationCartesianX = destinationTarget["cartesianX"];
			var destinationCartesianY = destinationTarget["cartesianY"];
			//검색 결과에서 주는 좌표는 우리가 이제껏 받아온 위도 경도가 아니라 카텍좌표계이다.
			var oPoint = new nhn.api.map.TM128(destinationCartesianX, destinationCartesianY);
			//찾은 좌표로 지도의 중심을 재설정한다. 
			oNaverMap.oMap.setCenter(oPoint);
			//결과를 명확하게 하기 위해 zoomlevel을 키운다 . 
			oNaverMap.oMap.setLevel(13);
		}
	},
	
	unfoldByMenuElement: function(menuElement) {
		
		// 메뉴가 클릭되어 정상적으로 실행되었습니다.
		// 우선 마지막 클릭되었던 element의 className를 비워줍니다.
		if (this.eLatestClickedMenu) {
			removeClassName(this.eLatestClickedMenu, "on");
			removeClassName(this.eLatestPanelContents, "on");
		}
		// 마지막 클릭된 element를 현재 클릭된 element로 갱신합니다.
		this.eLatestClickedMenu = menuElement.parentNode;
		this.eLatestPanelContents = document.getElementById("pc_" + menuElement.className);
		
		// .on을 달아 메뉴 색상과 panel_content를 변경합니다.
		addClassName(this.eLatestClickedMenu, "on");
		addClassName(this.eLatestPanelContents, "on");
		
		this._unfoldPanelContents();
	},
	
	initialize: function(){
		this.ePanel = document.getElementById("panel");	
		this.addEvents();
	}
}

/*********************************************************************************************************
 * 네비게이션관련 소스코드 끝
 **********************************************************************************************************/

/*********************************************************************************************************
 * 네이버맵 API관련 소스코드 시작
 **********************************************************************************************************/
var oNaverMap = {
		naverMap: null, //Main Page에서 Map영역에 해당하는  div객체
	    oCenterPoint: null, //지도 중심으로 포커싱할 위치를 저장하는 객체 (LatLng 좌표사용)
	    oMap: null, //맵옵션을 모두 저장하고 있는 지도의 기본이 되는 객체
	    oIcon: null,
	    oIcons: null,
	    oMarkerInfoWindow: null,
	    
	    
	    /*
	    //oCurrentViewPointMarkers는 다음과 같은 형태이다.
	    {
			"마커고유아이디": {
				location_latitude: "", 
				location_longitude: "", 
				location_name: "", 
				chatRoom: [
					{
						id: "",
						title: "",
						limit: ""
					}
				]			
			}
		} 
	    */
	    oCurrentViewPointMarkers: null,
	    oZoomController: null, // 줌인, 줌아웃 동작을 위한 버튼 객체
	    eClickedAddress : null, //역지오 코딩을 위한 클릭된 곳의 주소 element
	    
	    //지도위에 마커를 더하는 소스코드. 인자로 위도, 경도, 채팅방의 고유번호, 채팅방제목을 가져온다.
	    addMarker: function(latitude, longitude, markerNumber, title, hasMultiChatRoom) {
	    	//Point 객체를 생성한다.
	    	 var oPoint = new nhn.api.map.LatLng(latitude, longitude);
	    	
	    	 //마커객체를 생성한다.
	    	 var oMarker = null;
	    	 
	    	 if ( hasMultiChatRoom === true ) {
	    		oMarker = new nhn.api.map.Marker(this.oIcons);
	    		//attribute 설정
	    		oMarker["hasMultiChatRoom"] = true;
	    	 } else {
	    		 oMarker = new nhn.api.map.Marker(this.oIcon);
	    		 
	    		 oMarker["hasMultiChatRoom"] = false;
	    	 }
	    	 
	    	//마커객체에 Point를 설정한다.
	    	oMarker.setPoint(oPoint);
	    	//마커객체에 Attirubte를 추가한다. (markerNumber)
	    	oMarker.markerNumber = markerNumber;
	    	
	    	//맵에 마커를 더한다.
	    	this.oMap.addOverlay(oMarker);
	    },
	    
	    /*
	    //oMarker는 다음과 같은 형태이여야 한다.
		{
			id : "마커고유아이디", 
			location_latitude: "", 
			location_longitude: "", 
			location_name: "", 
			chatRoom: [
				{
					id: "",
					title: "",
					limit: ""
				}
			]
		} 
	    */
	    updateViewPointMarker: function(oMarker) {
	    	if ( oMarker === undefined ||oMarker === null )
	    		return null;
	    	
	    	//현재 보고있는 맵 안의 마커정보들은 메모리상에서 유지하고 있다.
	    	//메모리상의 데이터에 새로이 업데이트를 요구받은 Marker데이터가 있는지 없는지 판별한다.
	    	var isAlreadyExists = this.oCurrentViewPointMarkers.hasOwnProperty(oMarker["id"]);

	    	//만약 메모리에 해당 마커에 대한 정보가 없으면
	    	if ( isAlreadyExists === false ) {
	    		//메모리에 해당 마커에 대한 정보를 추가한다.
	    		this.oCurrentViewPointMarkers[oMarker["id"]] = oMarker;
	    		
	    		//그리고 마커를 생성한다.
	    		//TODO title이 존재하지 않는다.
	    		//이 부분은 hover액션을 마커에 주어서 사용하지 않을것인지를 먼저 결정한 후 진행하도록 한다.
	    		//working4
	    		var hasMultiChatRoom = false;
	    		
	    		if ( oMarker["chatRooms"] !== undefined && oMarker["chatRooms"] !== null ) {
	    			hasMultiChatRoom = (oMarker["chatRooms"].length > 1);
	    		}
	    		
	    		this.addMarker(oMarker['location_latitude'], oMarker['location_longitude'], oMarker['id'], oMarker['title'], hasMultiChatRoom);
	    		
	    	//만약 메모리에 해당 마커에 대한 정보가 존재하면,
	    	//새로 서버에서 받은 마커정보안의 채팅방 리스트를 찾아 메모리 객체에 저장한다.
	    	} else {
	    		this.oCurrentViewPointMarkers[oMarker["id"]]["chatRooms"] = oMarker["chatRooms"]; 
	    		
	    		//수정되어야 하는 경우는 다음과 같다.
	    		//1. 다수의 채팅방의 마커를 가지고 있으나, 업데이트결과 단일 채팅방이 된 경우
	    		if ( oMarker["hasMultiChatRoom"] === true && oMarker["chatRooms"].length === 1 ) {
	    			oMarker._elEl.src = "/images/marker_one_48.png";
	    		//2. 단일 채팅방의 마커를 가지고 있으나, 업데이트결과 다수의 채팅방이 된 경우
	    		} else if ( oMarker["hasMultiChatRoom"] === false && oMarker["chatRooms"].length > 1 ){
	    			oMarker._elEl.src = "/images/marker_48.png";
	    		}
	    		
//	    		var aChatRoomsInMemory = this.oCurrentViewPointMarkers[oMarker["id"]]["chatRooms"];
//	    		var aChatRoomsToUpdate = oMarker["chatRooms"];
//
//	    		//TODO 성능개선을 위해 추가작업 필요,
//	    		//database query 시 charRoom id값을 기준으로 정렬해온다면, sorting에 cost를 줄일 수 있다.
//	    		//메모리상에 새로운 데이터를 저장합니다.
//	    		var chatId = null;
//	    		var isExists = false;
//	    		for ( oNewChatRoom in aChatRoomsToUpdate) {
//	    			charId = oNewChatRoom["id"];
//	    			for ( oMemoryChatRoom in aChatRoomsInMemory ) {
//	    				if ( oNewChatRoom["id"] === oMemoryChatRoom["id"] )
//	    					isExists = true;
//	    			}
//	    			
//	    			if ( isExists === false ) {
//	    				aChatRoomsInMemory.push(oNewChatRoom);
//	    			} else {
//	    				isExists = false;
//	    			}
//	    		}
	    	}
	    },
	    //지도위의 Map 마커상태값을 업데이트하는 메서드.
	    //TODO 현재 네트워크 부하를 줄일 수 있는 알고리즘이나 방법을 생각한다.
	    updateViewPointMarkers: function() {
	    	
	    	//지도의 왼쪽상단, 오른쪽하단의 좌표값을 가진 Point Array를 가져온다.
	    	var aCurrentMapPoints = this.oMap.getBound();
	    	
	    	//Point Array의 값이 정상적일 경우 현재 화면의 마커정보를 네트워크 요청을 통해 가져온다.
	    	if ( aCurrentMapPoints !== null || aCurrentMapPoints.length !==0 || aCurrentMapPoints !== undefined )  {
	    		
	    		//oAjax모듈을 사용하기 위하여, 요청시 전달할 왼쪽상단, 오른쪽하단의 위도 경도값을 다음과같이 초기화한다.
	    		var oParameters = {
	    			"leftTopX": aCurrentMapPoints[0]['x'],
	    			"leftTopY": aCurrentMapPoints[0]['y'],
	    			"rightBottomX": aCurrentMapPoints[1]['x'],
	    			"rightBottomY": aCurrentMapPoints[1]['y']
	    		};
	    		
	    		//TODO GET방식의 요청에서 서버에러가 발생하고 있으므로, 임시로 POST요청을하도록 한다.
	    		//oAjax.getObjectFromJsonGetRequest("/chat/getList", oParameters);
	    		var callback = function(request) {
	    			var oResponse = JSON.parse(request.responseText);
	    			var isSuccess = oResponse['isSuccess'];

	    			if ( isSuccess ) {
		    			var aMarkerList = oResponse["markerList"];
		    			//Marker정보가 담긴 Array를 돌면서 현재 맵뷰상의 마커정보를 업데이트한다.
		    			for (var index in aMarkerList) {
		    				this.updateViewPointMarker(aMarkerList[index]);
		    			}
		    		} else {
		    			alert("네트워크 상태가 불안정합니다.\n갱신데이터를 불러오지 못하였습니다.");
		    			//location.reload(true);
		    		}
	    		}
	    		
	    		oAjax.getObjectFromJsonPostRequest("/chat/getList", oParameters, callback.bind(this));
	    	}
	    },
	    
	    // Zoom 조절을 위한 함수
	    changeZoom: function(nZoomLevel) {
	        this.oCenterPoint = this.oMap.getCenter();

	        //change zoom method
	        this.oMap.setPointLevel(this.oCenterPoint, nZoomLevel, {
	        	useEffect: true,
	        	centerMark: false
	        });
	    },
	    
	    // 축척 레벨(Zoom)을 가져오기 위한 함수
	    getZoom: function() {
	    	return this.oMap.getLevel();
	    },

	    // 줌 조절을 위해 줌인, 줌아웃 버튼에 클릭 이벤트 추가
		addEventForZoom: function() {
			this.oZoomController.zoomInButton.addEventListener('click', this.changeZoomLevel.bind(this));
			this.oZoomController.zoomOutButton.addEventListener('click', this.changeZoomLevel.bind(this));
		},

		// 줌인, 줌아웃 버튼에 클릭 이벤트가 발생하면 호출되는 줌 조절 메서드
		changeZoomLevel: function(e){
			var currentZoomLevel = this.getZoom();

			if(e.target.id === "zoomInButton") {
				this.changeZoom(++currentZoomLevel);
			}
			else if(e.target.id === "zoomOutButton") {
				this.changeZoom(--currentZoomLevel);
			}
		},

	    // 원하는 동작을 구현한 이벤트 핸들러를 attach함수로 추가.
	    // void attach( String sEvent, Function eventHandler) 이벤트명,  이벤트 핸들러 함수
	    attachEvents : function(){
	        this.oMap.attach("dragstart",this.dragStartEvent.bind(this));
	        this.oMap.attach("dragend",this.dragEndEvent.bind(this));
	        this.oMap.attach("mouseenter",this.mouseEnterEvent.bind(this));
	        this.oMap.attach("click", this.clickEvent.bind(this));
	    },

	    //move event가 발생한 후 click이벤트가 발생한다.
	    //drag 시작할 때 mapClickWithoutMarker를 화면상에서 보이지 않게끔 처리한다.
	    dragStartEvent : function(oCustomEvent){
	        oMapClicker.invisible();
	    },

	    //TODO 네트워크 비용을 낮추기위해 내부적으로 현재 좌표이동을 체크하는 로직이 필요하다. (현재는 클릭만해도 동작)
	    //TODO Drag를 위한 최소단위 설정을 고려해보자.
	    dragEndEvent: function(oCustomEvent) {
	    	this.updateViewPointMarkers();
	    },
	    
	    clickEvent: function(oCustomEvent) {
	    	var oTarget = oCustomEvent.target;
	        this.oMarkerInfoWindow.setVisible(false);
	        // 마커 클릭하면
	        if (! (oTarget instanceof nhn.api.map.Marker)) {
	        	//클라이언트에 상대적인 수평, 수직좌표 가져오기
	        	clientPosX = oCustomEvent.event._event.clientX;
	        	clientPosY = oCustomEvent.event._event.clientY;
	                
	        	oMapClicker.oClickPoint = oCustomEvent.point;
	        	oMapClicker.move(clientPosX, clientPosY);
	                
	        	//oMapClicker에 장소명을 업데이트한다.
	        	var callback = function(results, status){
	        		if(status == google.maps.GeocoderStatus.OK) {
	        			if (results[0]) {
	        				oMapClicker.setLocationName(results[0].formatted_address);
	        				console.log("fomatted_address : ",results[0].formatted_address);
	        			} else {
	                		console.log("reverseGeoCode status not fine ");
	                	}
	                };
	        	}
	        	oReverseGeoCode.getAddress(oCustomEvent.point.y, oCustomEvent.point.x, callback);
	        }
	    },
	    //working4
	    mouseEnterEvent : function(oCustomEvent) {
	        var oTarget = oCustomEvent.target;
	        this.oMarkerInfoWindow.setVisible(false);
	        // 마커 클릭하면
	        if (oTarget instanceof nhn.api.map.Marker) {
	        	console.log(oTarget);
	            // 겹침 마커 클릭한거면
	            //if (!oCustomEvent.clickCoveredMarker) {
	            	
	            	//현재는 마커전체레벨로 저장하고 있다.
	                
	                // - InfoWindow 에 들어갈 내용은 setContent 로 자유롭게 넣을 수 있습니다. 외부 css를 이용할 수 있으며, 
	                // - 외부 css에 선언된 class를 이용하면 해당 class의 스타일을 바로 적용할 수 있습니다.
	                // - 단, DIV 의 position style 은 absolute 가 되면 안되며, 
	                // - absolute 의 경우 autoPosition 이 동작하지 않습니다. 
	                // - html코드 뿐만 아니라, element를 삽입할 수 있습니다. 
	                // - 현재 우리 프로젝트에서는 하나의 엘리먼트를 각각 클릭마다 업데이트하여 사용하고 있습니다.
	            		
	            	//새로 클릭한 마커는, 고유 마커의 정보를 담고 있어야 합니다.
	            	//새로운 마커정보를 담은 윈도우 객체를 oMarkerClicker로부터 가져옵니다.
	                this.oMarkerInfoWindow.setContent(oMarkerClicker.getNewMarkerInfoWindowElement(oTarget.markerNumber)); //
	                this.oMarkerInfoWindow.setPoint(oTarget.getPoint());
	                this.oMarkerInfoWindow.setVisible(true);
	                this.oMarkerInfoWindow.setPosition({ //지도 상에서 정보창을 표시할 위치를 설정 
	                    right: 0,
	                    top: -19
	                });

	                //TODO getPosition 결과값을 읽어서 적절히 autoPosition(value값)으로 이동시키도록 한다.
	                //oMarkerInfoWindow.autoPosition(); //정보 창의 일부 또는 전체가 지도 밖에 있으면, 정보 창 전체가 보이도록 자동으로 지도를 이동 
	            //}
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
	        this.oIcon = new nhn.api.map.Icon("/images/marker_one_48.png", oSize, oOffset); //멀티채팅방 마커 설정 정보 (채팅방 이미지가 1개)
	        this.oIcons = new nhn.api.map.Icon("/images/marker_48.png", oSize, oOffset); //단일채팅방 마커 설정 정보 (채팅방 이미지가 2개)
	        this.oMarkerInfoWindow = new nhn.api.map.InfoWindow(); // - 마커를 클릭했을 때 뜨는 창. html코드뿐만 아니라 객체도 삽입 가능
	        
	        this.oMarkerInfoWindow.setVisible(false);   // - infowindow 표시 여부 지정
	                                                    //여기서는 true로 바꿔도 아무 변화가 없음  
	        this.oMap.addOverlay(this.oMarkerInfoWindow); // - 지도에 추가
	        
	         //네이버에서 자동으로 생성하는 지도 맵  element의 크기자동조절을 위해 %값으로 변경한다. (naver_map하위에 생긴다)
	        var eNmap = document.getElementsByClassName("nmap")[0];
	        eNmap.style.cssText = "width:100%;height:100%;";
	        
	        //setSize를 이용해서 변경을 하면 화면이 전부 날아가는 현상이 발생함..
	        //this.oMap.setSize(new nhn.api.map.Size(this.mapDivWidth, this.mapDivHeight));
	        
	        //메모리상에 현재 화면에 존재하는 마커정보를 담기위한 Object 선언
	        //맵 드래그, 데이터 업데이트 등을 수행할때
	        //이미 맵에 추가된 마커는 정보만 업데이트 하는 등을 판별하기 위해서 필요하다.
	        this.oCurrentViewPointMarkers = new Object();
	        
	        // 줌인, 줌아웃 동작을 위해 줌인 버튼과 줌아웃 버튼을 생성하고
	        // 각 버튼의 클릭 이벤트를 통해 줌 레벨 변경할 수 있게 만든다.
	        this.oZoomController = {
	        		zoomInButton: document.getElementById("zoomInButton"),
	        		zoomOutButton: document.getElementById("zoomOutButton")
	        }
	        this.addEventForZoom();
	    }
};

/*********************************************************************************************************
 * 네이버맵 API관련 소스코드 끝
 **********************************************************************************************************/


/*********************************************************************************************************
 * Marker Interaction 메뉴 소스코드 시작
 **********************************************************************************************************/
//채팅방이 생성되어있는 marker를 눌렀을 때 나오는 파란색 삼분 동그라미와 관련된 객체 
var oMarkerClicker = { 
	
	initialize: function() {
		this.controlBox = document.getElementById("controlBox");
		this.menu = this.controlBox.querySelector("#menu");
		this.eChattingDivBox = this.controlBox.querySelector(".menu-chatting.content");
		this.eChatList = this.eChattingDivBox.querySelector("ol");
		this.eMenuInfo = this.controlBox.querySelector(".menu-info");
		
		menu.addEventListener("mouseover", this.mouseOver.bind(this), false);
		menu.addEventListener('mouseout', this.mouseOut.bind(this), false);
		
		//채팅리스트가 속해있는 영역을 클릭할 경우, 이벤트가 발생하도록 등록
		this.eChattingDivBox.addEventListener('click', this.clickChatRoomList, false);
		
		//첫째줄, 마커클릭시 나타나는 3개의 메뉴중, 12시 방향에 나타나는 info에 해당하는 버튼
		//둘째줄, iconInfo버튼 상위에 미리 만들어 놓은 div, 내용을 보여주기 위한 영역
		//셋째줄, Custom Listener객체에 등록한다. (메뉴아이콘, 미리만들어 놓은 content div영역)
		var iconInfo = controlBox.querySelector('.icon-info');
		var menuInfo = controlBox.querySelector('.menu-info');
		this.addListener(iconInfo, menuInfo);
		
		var iconChatting = controlBox.querySelector('.icon-chatting');
		var menuChatting = controlBox.querySelector('.menu-chatting');
		this.addListener(iconChatting, menuChatting);
	},
	
	// Ajax통신을 통해 마커 안에 있는 채팅방들의 현재 채팅 인원 수를 가져와 리턴하는 메서드
	getCurrentNumOfParticipantByAjax: function(chatRoomId) {
		var incompleteUrl = "/markerClicker/getCurrentNumOfParticipant";
		var oParameter = {
				"chatRoomId": chatRoomId
		};
		var currentNumOfParticipants = null;
		
		var callback = function(request) {
			//if (typeof request === "object")
			this.currentNumOfParticipants = JSON.parse(request.responseText);
		};
		
		oAjax.getObjectFromJsonGetRequest(incompleteUrl, oParameter, callback.bind(this));
		
		return this.currentNumOfParticipants;
	},
	
	clickChatRoomList: function(e) {
		//클릭된 지점이 채팅방 생성 버튼 지점이면 채팅방 입장 요청을 하지 않는다.
		if(e.target.className === "createChattingRoomButtonInMarkerClicker") {
			return;
		}
		//클릭되는 대상의 부모인 li태그 element를 가져와서, 
		//추가될때 저장되어 있던 chatRoomNumber Attribute를 가져온후, 채팅방 입장을 요청한다.
		oChat.enterChatRoom(e.target.parentNode.chatRoomNumber);
	},
	
	//사용자가 새로 클릭한 마커에 대한 정보를, 마커 인터렉션 창에 업데이트 시켜주는 함수이다.
	//예를들어 채팅방목록, 장소 정보 등등
	getNewMarkerInfoWindowElement: function(markerNumber) {
		//이전에 클릭데이터를 초기화한다.
		this.reset();

		/*
		 * TODO
		 * 기존에 존재하는 li element를 최대한 재활용 하기 위해, 
		 * 기존 template Element에 존재하는 li갯수와 
		 * 마커에서 새로 추가해야하는 채팅방 갯수를 판별해서 분기문을 수행한다.
		 */
		

		//메모리에 존재하는 마커정보를 가져온다.
		//현재 마커 아이디를 토대로, 
		//맵뷰상에 존재하는 메모리를 저장하고 있는 oCurrentViewPointMarkers 에서 가져온다.
		var oMarkerInfo = oNaverMap.oCurrentViewPointMarkers[markerNumber];
		//마커정보를 담고있는 Object에서 마커에 해당하는 chatRoom정보들을 담고있는 Array를 가져온다.
		var aChatRoomInMarker = oMarkerInfo["chatRooms"];
		
		//마커내부의 채팅방갯수에 따라 click window에 노출되는 이미지를 변경해준다.
		if ( aChatRoomInMarker.length >= 2 ) {
			this.eMarkerNavigationImage.style.backgroundImage = "url(/images/marker_clicked_48.png)";
		} else {
			this.eMarkerNavigationImage.style.backgroundImage = "url(/images/marker_one_clicked_48.png)";
		}
		
		//chatRoom의 장소 정보를 업데이트
		this.eMenuInfo.innerText = oMarkerInfo["location_name"]; 
		/*
		 * 기존 element에 존재하는 template정보
		 */
		//기존에 존재하는 li엘리먼트를 복사해서 template변수로 저장한다.
		var chatRoomTemplate = this.controlBox.querySelector(".chatRoom").cloneNode(true);
		
		//위에서 template변수로 저장했기 때문에, ol태그 하위의 기존 li엘리먼트를 모두 삭제한다.
		while (this.eChatList.firstChild) {
		    this.eChatList.removeChild(this.eChatList.firstChild);
		}
		
		//for문안에서 사용할 변수를 선언 (매 for문마다 생성하면 낭비잖아)
		var eNode = null;
		var eTitle = null;
		var eParticipant = null;
		var newChatRoom = null;
		//메모리상에 있는 데이터를 가져온다.
		//마커에 해당하는 채팅방목록을 하나씩 돌면서
		for ( var index = 0 ; index < aChatRoomInMarker.length ; ++index ) {
			newChatRoom = aChatRoomInMarker[index];
			
			//채팅방의 현재 참여 인원을 Ajax 통신을 통해 가져온다.
			var currentParticipant = this.getCurrentNumOfParticipantByAjax(newChatRoom["id"]);

			//템플릿 element를 복사해온다.
			eNode = chatRoomTemplate.cloneNode(true);
			eTitle = eNode.children[0];
			eParticipant = eNode.children[1];
			
			//element Object에 id값을 Attribute로 저장, 나머지 엘리먼트에는 적절한 데이터값을 입력한다.
			eNode.chatRoomNumber = newChatRoom["id"];
			eTitle.innerText = newChatRoom["title"];
			eParticipant.innerText = currentParticipant + "/" +newChatRoom["max"];
			
			//새로운 li 엘리먼트를 추가
			this.eChatList.appendChild(eNode);
		}
		
		//채팅리스트 안에 있는 채팅방 생성 버튼을 만드는 부분
		var createChattingRoomButtonInMarkerClicker = document.querySelector(".createChattingRoomButtonInMarkerClicker");
		var oLocationPoint = {
				"y": oMarkerInfo["location_latitude"],
				"x": oMarkerInfo["location_longitude"]
		};
		this.eChattingDivBox.appendChild(createChattingRoomButtonInMarkerClicker);
		createChattingRoomButtonInMarkerClicker.addEventListener('click', function(e) {
			oCreateChattingRoom.visible(this.eMenuInfo.innerText, oLocationPoint);
		}.bind(this), false);
		
		//템플릿 element 삭제
		chatRoomTemplate.remove();
		
		//높이값을 채팅방 영역에 맞게 조절
		//TODO 하드코딩되어 있는 px 수정 (26)
		this.eChattingDivBox.style.cssText = "height:" + 26*(aChatRoomInMarker.length+1) + "px;";
		
		return this.controlBox;
	},
	eMarkerNavigationImage: document.querySelector("#controlBox .hide-navigation"),
	//물음표에 hover하면 나오는 정보창을 담을 element
	eMenuInfo: null,
	//마커 클릭액션시 나타나는 content, 메뉴바 등을 모두 포함하는 div
	controlBox: null,
	//채팅방 리스트를 모두 담고 있는 컨텐츠 OL엘리먼트
	eChatList: null,
	//채팅방 내용을 담고있는 division <div> element
	eChattingDivBox : null,
	//사용자와 인터렉션하는 원형 메뉴바
	menu: null,
	//메뉴버튼 객체를 담을 Array
	aIcons: [],
	//메뉴 내용을 담는 Content 객체를 담을 Array
	aMenues: [],
	
	//현재 메뉴아이콘의 클릭여부, 메뉴객체의 크기 등을 default상태로 변경해준다.
	//메뉴 크기는 원래 작은크기로, 클릭된 여부는 "none"으로 초기화 하는 작업 등을 수행
	reset: function() {
		for(var i = 0 ; i < this.aIcons.length ; ++i ) {
			this.changeNoneClickStatus(this.aIcons[i], this.aMenues[i]);
		}
	},
	
	//클릭된 메뉴가 있는지 확인하는 함수, boolean값을 리턴한다.
	isClickedComponentExists: function() {
		for (var index = 0 ; index < this.aIcons.length ; ++index ) {
			var iconStatus = this.aIcons[index].getAttribute("status");
		
			if ( iconStatus === "clicked") {
				return true;
			}
		}
		
		return false;
	},
	
	//메뉴버튼위에 마우스가 올라갔을때
	mouseOver: function() {
		//메뉴크기를 늘리면서 메뉴버튼들이 보인다. (애니메이션 효과가 css를 통해 자동으로 동작)
		this.menu.style.cssText = "width:150px;height:150px;margin:-75px 0 0 -75px";
	},	
	
	//메뉴버튼위에서 마우스가 빠져나갈때
	mouseOut: function() {
		//클릭된 메뉴가 없을경우
		if (!this.isClickedComponentExists()) {
			//메뉴크기를 줄어들면서 메뉴버튼들이 사라진다. (애니메이션 효과가 css를 통해 자동으로 동작)
			this.menu.style.cssText = "width:75px;height:75px;margin:-37.5px 0 0 -37.5px";
		}
	},
	
	//아이콘이 클릭되지 않았던 상태에서 클릭을 했을경우
	changeClickStatus: function(oIcon, oMenu) {
		oIcon.setAttribute('status','clicked');
		oIcon.style.status = 'clicked';
		oIcon.children[0].style.backgroundColor = "#9dd";
		this.mouseOver();		
	},
	
	//클릭되었던 상태의 아이콘을 다시 클릭 했을경우
	changeNoneClickStatus: function(oIcon, oMenu) {
		oMenu.style.display = 'none';
	
		oIcon.setAttribute('status','none');
		oIcon.style.status = 'none';
		oIcon.children[0].style.backgroundColor = "#8cc";
		
		if (!this.isClickedComponentExists()) {
			this.mouseOut();		
		}
	},
	
	//외부에서 addListener 함수를 통해서 새로적용되는 메뉴버튼과, 메뉴 컨텐츠영역을 전달받는다.
  	addListener: function (oIcon, oMenu) {
		//아이콘정보를 Array에 담는다. 현재는 채팅방, 안내에 대한 icon Object를 담는다.
  		//클린된 메뉴가 있는지 없는지를 체크하고, 초기화하는 등의 액션을 위해 필요하다.
		this.aIcons.push(oIcon);
		
		//각 아이콘에 해당하는 Contents영역의 정보를 Array에 담는다.
		//마커를 이동할 때마다 reset해줘야 하는 정보를 위해서 Array에 담아둔다.
		this.aMenues.push(oMenu);
		//마우스가 메뉴아이콘 위에 위치할경우, Content영역이 보여지도록 한다.
		oIcon.addEventListener('mouseover', function() {
			oMenu.style.display = 'block';
		}.bind(this),false);
  
		oIcon.addEventListener('mouseout', function() {
			var status = oIcon.getAttribute('status');
		
			if ( status != 'clicked')
				oMenu.style.display = 'none';
		}.bind(this),false);
	
		//클릭을 통해 Content영역을 고정할 수 있도록 하기 위한 이벤트
		oIcon.addEventListener('click', function(e) {
			e.preventDefault();
		
			var status = oIcon.getAttribute('status');
			
			if (status === 'clicked') {
				this.changeNoneClickStatus(oIcon, oMenu);
			} else if (status === 'none') {
				this.changeClickStatus(oIcon, oMenu);
			}
		}.bind(this),false);	
  	}
}
/*********************************************************************************************************
 * Marker Interaction 메뉴에 대한 소스코드 끝
 **********************************************************************************************************/

/*********************************************************************************************************
 * Chatting에 대한 소스코드 시작
 **********************************************************************************************************/
//TODO ChattingRoom 에 대한 항목도 Merge해야한다.
/*
 * TODO 모든 메뉴에 대한 처리를 구별, 각각에게 알맞게 처리하도록 수정해야 한다.
 */
var oChat = {
		functionTempForMoveWindow: null,
		socket: null,
		eChatWindow: document.getElementById("chatWindow"),
		eRightArea: document.querySelector("#chatWindow .rightArea"),
		eChattingMemberList: document.querySelector("#chatWindow .chattingMemberList ul"),
		eInputBox: document.querySelector("#chatWindow .inputArea"),
		eFoldButton: document.querySelector("#chatWindow .icon-aside"),
		eExitButton: document.querySelector("#chatWindow .icon-exit"),
		
		//채팅창 안의 element
		eChatWindowTopBar: document.querySelector("#chatWindow .top"),
		eChatWindowTitle: document.querySelector("#chatWindow .top .title"),
		eChatWindowParticipant: document.querySelector("#chatWindow .top .limit"),
		eChatWindowAddress: document.querySelector("#chatWindow .top .address"),
		eChatWindowMessageBox: document.querySelector("#chatWindow .middle .chattingContents"),
		
		//Template element
		eTemplateNotice: document.querySelector("#template .notice"),
		eTemplateUser: document.querySelector("#template .user"),
		eTemplateOther: document.querySelector("#template .other"),
		eTemplateChatMember: document.querySelector("#template .chatMember"),
		
		
		//메모리에 저장하고 활용하는 데이터
		userId: 0,
		currentChatRoomNumber: 0,
		lastMessageDayNum: 0,
		
		//working
		/*
	    //oInfo는 다음과 같은 형태이다.
	    {
			"채팅방번호": {
				title: "",
				locationName: "", 
				max: "",
				participantNum: "",
				unreadMessageNum: "", 
				eTarget: "",
				oParticipant: {
					"회원아이디": 
					{
						nickname: "",
						TODO 추가데이터
					}
				}
				
				//eTarget은 초기화시 추가해주는 동적 attribute이다.
				//어차피 채팅방번호에 해당하는 element를 자주참조해야하므로 주소값을 저장하는 것이다.
				//자세한 내용은 getMyChatInfoAndUpdateListInPanel 함수를 참조하자.
			}
		} 
	    */
		oInfo: null,
		
		// 채팅방 입장 시
		enterChatRoom: function(chatRoomNum) {
			// 입장을 서버에 알린다.
			// 이메일 정보와 참여하는 채팅방 번호를 같이 전달한다.			
			this.socket.emit('join', {"chatRoomNumber": chatRoomNum});
		},
		
		//채팅창을 열고, 필요한 데이터를 채팅창에 채움니다.
		showChatWindow: function(chatRoomNum) {
			if ( oChat.isChatWindowVisible() ) {
				oChat.foldChattingRoom();
			}
			
			oChat.saveCurrentChatRoomNumber(chatRoomNum);
			console.log("chatRoomNumber :",chatRoomNum);
			oChat.oInfo[chatRoomNum]["unreadMessageNum"] = 0;
			
			oChat.updateChatWindowHeaderText(chatRoomNum);
			oChat.updateMemberList(chatRoomNum);
			oChat.updateNotificationView(chatRoomNum);
			oChat.visibleChatWindow();
			
			//scrollHeight설정은 chatWindow가 보여질때만이 속성값 변경이 가능하다. 
			//때문에 가장 마지막에 실행해준다.
			oChat.updateInitializeMessage(chatRoomNum);
		},

		visibleChatWindow: function() {
			this.eChatWindow.style.display = "block";
		},
		
		invisibleChatWindow: function() {
			this.eChatWindow.style.display = "none";
		},
		
		isChatWindowVisible: function() {
			return (this.eChatWindow.style.display == "block");
		},
		
		saveCurrentChatRoomNumber: function(chatRoomNum) {
			this.currentChatRoomNumber = chatRoomNum;
			this.socket.emit("saveCurrentChatRoomNumber", {"currentChatRoomNumber": chatRoomNum});
		},
		
		sendMessage: function(message) {
			
			oMessageInfo = {
				"message": message,
				"chatRoomNumber": this.currentChatRoomNumber,
			};
			
			this.socket.emit('message', oMessageInfo);
			this.eInputBox.value="";
		},
		
		getMessage: function(oMessageInfo) {
			//자신이 보낸 메세지인지, 남이 보낸 메세지인지를 판별하기 위한 flag
			var flag = 0;
			var chatRoomNumber = oMessageInfo["tblChatRoomId"];
			
			//현재는 클라이언트에서 판별후 attribute를 생성하고 있다.
			//TODO isMyMessage를 웹서버에서 처리할 수 있도록 변경해야 한다.
			if ( oMessageInfo["tblMemberId"] == this.userId ) {
				flag = 1;
			}
			
			oMessageInfo["isMyMessage"] = flag;
			
			if ( chatRoomNumber == oChat.currentChatRoomNumber ) {
				this._updateOneMessage(oMessageInfo);
				
			} else {
				console.log("before add UnreadMessgae : ", oChat.oInfo[chatRoomNumber]["unreadMessageNum"]);
				oChat.oInfo[chatRoomNumber]["unreadMessageNum"]++;
				oChat.updateNotificationView(oMessageInfo["tblChatRoomId"]);
				console.log("before add UnreadMessgae : ", oChat.oInfo[chatRoomNumber]["unreadMessageNum"]);
				oAside.updateTotalNotificationView();
			}
		},
		
		setMessageBoxScrollTop: function() {
			this.eChatWindowMessageBox.scrollTop = this.eChatWindowMessageBox.scrollHeight;
		},
		
		getMessageBoxScrollTop: function() {
			return this.eChatWindowMessageBox.scrollHeight;
		},
		
		updateMessageBoxScrollTop: function(height) {
			this.eChatWindowMessageBox.scrollTop = height;
		},
		
		isNewDay: function(dayNum) {
			var isNew = this.lastMessageDayNum != dayNum; 
			this.lastMessageDayNum = dayNum;
			return isNew;
		},
		
		_getNoticeTemplateCloneElement: function(message) {
			var eCopiedTemplate = this.eTemplateNotice.cloneNode(true);
			eCopiedTemplate.querySelector(".message").innerText = message;
			
			return eCopiedTemplate
		},
		
		_getUserMessageTemplateCloneElement: function(time, message) {
			var eCopiedTemplate = this.eTemplateUser.cloneNode(true);
			eCopiedTemplate.querySelector(".time").innerText = time;
			eCopiedTemplate.querySelector(".message").innerText = message;
			
			return eCopiedTemplate;
		},

		_getOtherMessageTemplateCloneElement: function(chatRoomNum, memberId, message, time, imgUrl) {
			
			var oMemberInfo = oChat.oInfo[chatRoomNum]["oParticipant"][memberId];
			var eCopiedTemplate = oChat.eTemplateOther.cloneNode(true);
			
			eCopiedTemplate.querySelector(".nickname").innerText = oMemberInfo["nicknameAdjective"] + oMemberInfo["nicknameNoun"];
			eCopiedTemplate.querySelector(".message").innerText = message;
			eCopiedTemplate.querySelector(".time").innerText = time;
			
			var eTargetProfile = eCopiedTemplate.querySelector(".profile"); 
			eTargetProfile.style.backgroundColor= oMemberInfo["backgroundColor"];
			eTargetProfile.style.backgroundImage="url("+oMemberInfo["backgroundImage"]+")";
			
			return eCopiedTemplate;
		},
		
		_updateOneMessage: function(oMessageInfo) {
			var eTarget = null;
			var day = oMessageInfo["day"];
			var month = oMessageInfo["month"];
			var time = oMessageInfo["time"];
			var week = oMessageInfo["week"];
			var message = oMessageInfo["message"];
			var isMyMessage = oMessageInfo["isMyMessage"];
			var chatRoomNum = oMessageInfo["tblChatRoomId"];
			var memberId = oMessageInfo["tblMemberId"];
			
			if ( this.isNewDay(day) ) {
				
				var sNotice = oMessageInfo["month"] 
										+ "월 "
										+ oMessageInfo["day"] 
										+ "일 "
										+ oMessageInfo["week"];
				
				eTarget = this._getNoticeTemplateCloneElement(sNotice);
			} 
			
			//내 메시지일경우
			if  (isMyMessage == 1) {
				eTarget = this._getUserMessageTemplateCloneElement(time, message);
			} else {
				//관리자 메세지인 경우
				if ( memberId === 0 ) {
					eTarget = this._getNoticeTemplateCloneElement(message);
				//일반 메세지일 경우
				} else {
					eTarget = this._getOtherMessageTemplateCloneElement(chatRoomNum, memberId, message, time, null);
				}
			}
			
			if (eTarget != undefined || eTarget != null) {
				this.eChatWindowMessageBox.appendChild(eTarget);
			}
			
			this.setMessageBoxScrollTop();
		},
		
		updateLastMessageDayNum: function(nDay) {
			this.lastMessageDayNum = nDay;
		},
		
		updateOneMessage: function(aMessage) {
			
			if ( aMessage == undefined 
					|| aMessage == null 
					|| aMessage.length === 0 )
				return;
			
			for ( var index = 0 ; index < aMessage.length ; ++ index ) {
				this._updateOneMessage(aMessage[index]);
			}
		},
		
		updateInitializeMessage: function(chatRoomNum) {
			//TODO 이렇게 삭제하는것과 innerHTML을 비우는것의 차이는..?
			//Message박스 초기화
			while (this.eChatWindowMessageBox.firstChild) {
				this.eChatWindowMessageBox.removeChild(this.eChatWindowMessageBox.firstChild);
			}
			
			var oParameters = {
    			"chatRoomNumber": chatRoomNum,
    		};
    		
    		var callback = function(request) {
    			var oResponse = JSON.parse(request.responseText);

    			var aRecentMessage = oResponse["recentMessage"];
    			var aUnreadMessage = oResponse["unreadMessage"];
    			this.updateOneMessage(aRecentMessage);
    			//working5
    			console.log("aUnreadMessage.length : ",aUnreadMessage.length);
    			console.log("aUnreadMessage.length !==0 ", aUnreadMessage.length !==0 );
    			if ( aUnreadMessage.length !== 0 ) {
    				
    				//멘트삽입
    				oChat.eChatWindowMessageBox.appendChild(this._getNoticeTemplateCloneElement("여기까지 읽으셨습니다."));
    				
    				console.log("aUnreadMessage : ",aUnreadMessage);
    				var unreadMessageScrollTop = oChat.getMessageBoxScrollTop();
    				console.log("unreadMessageScrollTop  : ", unreadMessageScrollTop );
    				oChat.updateOneMessage(aUnreadMessage);
    				
    				oChat.updateMessageBoxScrollTop(unreadMessageScrollTop-30);
    				
    			} else {
    				oChat.setMessageBoxScrollTop();
    			}
    			
    		}
    		
    		oAjax.getObjectFromJsonGetRequest("/chat/initMessage", oParameters, callback.bind(this));
		},
		
		//채팅창 상단에 보여지는 제목, 인원, 장소명 등의 데이터를 업데이트한다.
		updateChatWindowHeaderText: function(chatRoomNum) {
			var oTarget = this.oInfo[chatRoomNum];
			
			this.eChatWindowTitle.innerText = oTarget["title"];
			this.eChatWindowAddress.innerText = oTarget["locationName"];
			this.eChatWindowParticipant.innerText = oTarget["participantNum"] + " / " + oTarget["max"];
		},
		
		//패널의 채팅리스트에 존재하는 채팅방의 Notification VIew를 업데이트한다.
		updateNotificationView: function(chatRoomNum) {
			var oTarget = this.oInfo[chatRoomNum];
			console.log("updateNoti's oInfo : ", oChat.oInfo);
			var eChattingRoomNotification = oTarget["eTarget"].querySelector(".notification");
			
			var unreadMessageNum = oTarget["unreadMessageNum"];
			
			if ( unreadMessageNum === 0 ) {
				eChattingRoomNotification.style.display = "none";
	 		} else {
	 			eChattingRoomNotification.innerText = unreadMessageNum;
	 			eChattingRoomNotification.style.display = "inline-block";
	 		}
		},
		
		//채팅방 오른편의 참여자리스트에 참가자정보를 더하는 함수
		addMemberList: function(oParticipant) {
			var eCopiedTemplate = this.eTemplateChatMember.cloneNode(true); 
			oParticipant["eTarget"] = eCopiedTemplate; 
			
			var aPtag = eCopiedTemplate.querySelectorAll("p");
			aPtag[0].innerText = oParticipant["nicknameAdjective"];
			aPtag[1].innerText = oParticipant["nicknameNoun"];
			
			var eTargetProfile = eCopiedTemplate.querySelector(".profile");
			eTargetProfile.style.backgroundColor= oParticipant["backgroundColor"];
			eTargetProfile.style.backgroundImage="url("+oParticipant["backgroundImage"]+")";
			
			this.eChattingMemberList.appendChild(eCopiedTemplate);
		},
		
		removeMemberList: function(oParticipant) {
			this.eChattingMemberList.removeChild(oParticipant["eTarget"]);
		},
		
		//채팅창 오른편의 참여자리스트를 갱신하는 함수
		updateMemberList: function(chatRoomNum){
			var oTarget = this.oInfo[chatRoomNum]["oParticipant"];
			
			while (this.eChattingMemberList.firstChild) {
				this.eChattingMemberList.removeChild(this.eChattingMemberList.firstChild);
			}
			
			for (var key in oTarget) {
				if (oTarget.hasOwnProperty(key)) {
					this.addMemberList(oTarget[key]);
				}
			}
		},
		
		//working
		foldChattingRoom: function() {
			//서버에 채팅방 fold에 대한 요청을 보낸다.
			
			var url = "/chat/foldCurrentChatRoom";
			
			oParameter = {
				"chatRoomNumber": this.currentChatRoomNumber 	
			};
			
			var callback = function(request) {
				var result = request.responseText;

				// TODO 교수님께 질문드리기
				// ===로 비교하면 false 계속 리턴된다.. 왜그럴까? (index.js와 비교해서 볼것!)
				if ( result.indexOf("SUCCESS") !== -1 ) {
					this.invisibleChatWindow();
				} else {
					alert("다시 시도해주세요.");
				}
			}.bind(this);
			
			oAjax.getObjectFromJsonPostRequest(url, oParameter, callback);
			
			//채팅서버에 창을 닫았다는 사실을 알려준다.
			this.saveCurrentChatRoomNumber(null);
		},
		
		// oChat객체가 initialize되는 시점에 호출되어 사용자가 채팅중인 채팅방의 소켓 연결을 맺어준다.
		connectSocketWithEnteredChattingRoom: function() {
			var chattingRoomList = document.getElementById("enteredChattingRoomList").innerText;
			var chattingRoomListToJson = JSON.parse(chattingRoomList);
			var chattingRoomIdList = new Array();
			
			for ( var i = 0; i < chattingRoomListToJson.length ; i++ ) {
				chattingRoomIdList.push(chattingRoomListToJson[i].chatRoomId);
			}
			
			for ( var i = 0; i < chattingRoomIdList.length ; i++ ) {
				var chatRoomNum = chattingRoomIdList[i];
				this.socket.emit('autoConnectWithEnteredChattingRoom', {'email': this.socket.email, 'chatRoomNumber': chatRoomNum});
			}
		},
		
		//새로운 chatInfo항목을 추가한다.
		addChatInfo: function(chatRoomNumber, oResult) {
			console.log("parameter oResult : ",oResult);
			console.log("addChatInfo ================================");
			console.log("before : ",oChat.oInfo);
			oChat.oInfo[chatRoomNumber] = oResult;
			console.log("after : ",oChat.oInfo);
			console.log("addChatInfo ================================");
		},
		
		//chatInfo를 초기화한다.
		saveChatInfo: function(aParameter) {
			window.oChat.oInfo =  aParameter
		},
		/*
		 * 초기화때 1번 수행되는 함수입니다.
		 * 채팅에서 가장 중요한 데이터들을 oInfo에 저장하고, 채팅방리스트를 업데이트합니다.
		 * 
		 * TODO jsp에서 내려주는 형태로 리팩토링 되어야 합니다.
		 */
		getMyChatInfoAndUpdateListInPanel: function(){
			
			var incompleteUrl = "/chat/getMyChatInfo";
			
			var callback = function(request){

				var oResult = JSON.parse(request.responseText);
				
				//oInfo에 요청데이터를 저장
				this.saveChatInfo.apply(request, [oResult]);
				
				if(oResult === null || oResult.length === 0 ){
					oAside.vacantChattingList();
				} else {
					//이미 존재하는 채팅방 목록이 있면 지운다.
					var eTarget = oAside.eChattingListTarget;
					while (eTarget.firstChild) {
						eTarget.removeChild(eTarget.firstChild);
					}
					
					//for문을 돌면서 Aside의 채팅방리스트에 추가한다.
					for (var key in oResult) {
						if (oResult.hasOwnProperty(key)) {
							oAside.addChattingList(key, oResult[key]);
						}
					}
				}
				//확인하지 않은 메세지갯수를 업데이트한다.
				oAside.updateTotalNotificationView();
			};
			
			oAjax.getObjectFromJsonPostRequest(incompleteUrl, null, callback.bind(this));
		},
		
		// 채팅방의 top bar를 클릭하면 마우스 이동에 대한 이벤트를 등록한다.
		mouseDownAtChatWindowTopBar: function(e) {
			var sideBarSize = parseInt(getStyle(document.getElementById("nav_list"), "width"));
			var headerSize = parseInt(getStyle(document.getElementById("header"), "height"));
			var currentChatWindowLeft = parseInt(getStyle(this.eChatWindow, "left"));
			var currentChatWindowTop = parseInt(getStyle(this.eChatWindow, "top"));
			var distanceX = e.clientX - (sideBarSize + currentChatWindowLeft);
			var distanceY = e.clientY - (headerSize + currentChatWindowTop)
			this.functionTempForMoveWindow = this.moveChattingWindow.bind(this, sideBarSize, headerSize, distanceX, distanceY);

			window.addEventListener("mousemove", this.functionTempForMoveWindow, true);
			window.addEventListener("mouseup", this.mouseUp.bind(this), false);
		},
		
		// 마우스가 이동하는 동안 채팅창이 마우스를 따라다닌다.
		moveChattingWindow: function(e) {
			var sideBarSize = arguments[0];
			var headerSize = arguments[1];
			var distanceX = arguments[2];
			var distanceY = arguments[3];
			var event = arguments[4];
			
			this.eChatWindow.style.left = event.clientX - sideBarSize - distanceX + "px";
			this.eChatWindow.style.top = event.clientY - headerSize - distanceY + "px";
		},
		
		// 마우스를 떼면 채팅창이 마우스를 따라다니던 이벤트를 제거한다.
		mouseUp: function(e) {
			window.removeEventListener("mousemove", this.functionTempForMoveWindow, true);
		},
		
		initialize: function() {
			var email = document.getElementById("email").value;
			//hidden attribute. User Identifier Database id Value.
			//TODO 설정탭의 개인정보 수정과 함께 처리되어야 할 여지가 있다.
			this.userId = document.getElementById("id").value;
			
			var sParameters = "?userId="+this.userId + "&email=" +email.replace("@", "&domain=");
			this.socket = io.connect("http://127.0.0.1:3080"+sParameters); 
			
			// 엔터버튼을 누르면 메시지가 전송되도록 이벤트를 등록한다.
			this.eInputBox.onkeydown = function(event) {				
				if (event.keyCode == 13 && event.shiftKey) {
					this.eInputBox.value = this.eInputBox.value + "\n";
					event.preventDefault();
				} else if ( event.keyCode == 13 ) {
					this.sendMessage( this.eInputBox.value );
					event.preventDefault();
				}
			}.bind(this);
			
			// 접어두기 버튼을 누르면 채팅방을 접어두도록 이벤트를 등록한다.
			this.eFoldButton.addEventListener("click", function(e) {
				this.foldChattingRoom();
			}.bind(this), false);
			
			// 나가기 버튼을 누르면 채팅방에서 나가도록 이벤트를 등록한다.
			this.eExitButton.addEventListener("click", function(e) {
				if ( confirm("Are you sure Exit Chatting Room?")) {
					this.socket.emit('exit', {'chatRoomNumber': this.currentChatRoomNumber});
				}
			}.bind(this), false);
			
			//TODO NICK NAME 정보를 클라이언트에서 제공하고 있으며, 그 정보는 변조될 수 있다.
			//Nodejs에서 웹서버에 요청하는 형태, 혹은 그 반대가 되어야 한다.
			//P Tag에서는 .value가 적용되지 않아서 .innerText를 사용하였다.
			this.nickname = document.getElementById("user_name").innerText;
			
			this.socket.on('message', function (oParameter) {
				this.getMessage(oParameter);
			}.bind(this));
			
			this.socket.on("announce", function(message) {
				alert(message);
			});
			
			/*
			 * chatting Server에서 {callback: function() {...}} 형태로
			 * 파라미터를 전달해준다.
			 */
			this.socket.on("execute", function(oCallback) {
				oCallback.callback = new Function(oCallback.callback);
				if ( typeof oCallback.callback == "function" )
					oCallback.callback();	
			}.bind(this));
			
			//ChatWindow에서 참여자 리스트 패널 fold, unfold 이벤트를 연결한다.
			this.eRightArea.addEventListener('click', function(e) {
				
				//element 외의 영역을 클릭하는것이기 떄문에 before, after항목을 클릭한 경우이다.
				if ( e.offsetX > this.offsetWidth) {
					
					if ( e.target.className.indexOf("unfold") !== -1 ) {
						removeClassName(this, "unfold");
						addClassName(this, "fold");
					} else {
						removeClassName(this, "fold");						
						addClassName(this, "unfold");
					}					
				}
			}, false);
			
			// 기존에 접속해있던 채팅방의 소켓 연결을 맺어준다.
			this.connectSocketWithEnteredChattingRoom();
			
			//사용자가 참여하고있는 채팅방의 데이터를 oInfo객체에 저장한다.
			
//			"채팅방번호": {
//				title: "",
//				locationName: "", 
//				max: "",
//				unreadMessageNum: "", 
//				oParticipant: {
//					"회원아이디": 
//					{
//						nickname: "",
//						TODO 추가데이터
//					}
//				}
//			}
			this.getMyChatInfoAndUpdateListInPanel();
			
			// 채팅창 이동을 위한 이벤트 리스너 등록
			this.eChatWindowTopBar.addEventListener('mousedown', this.mouseDownAtChatWindowTopBar.bind(this), false);
		}
};
/*********************************************************************************************************
 * Chatting에 대한 소스코드 종료
 **********************************************************************************************************/

/*********************************************************************************************************
 * Create Chat Room 채팅방 생성에 대한 Hidden Area에 대한 소스코드 시작
 **********************************************************************************************************/
//TODO oChat안으로 들어가야 한다.
var oCreateChattingRoom = {
		//채팅방 생성에 해당하는 중앙창에 대한 element
		oCreateChatRoom: null,
		//채팅방명을 입력하는 input box element
		eRoomNameInput: null,
		//채팅방 참여인원 제한 수를 입력하는 input box element
		eLimitNumberInput: null,
		//채팅방을 생성하려고 하는 곳의 주소 
		eRoomAddress: null,
		//채팅방 생성 위치 좌표
		oLocationPoint: null,
		
		//채팅방 생성창을 열고, 다른메뉴와의 인터렉션을 막는 함수
		visible: function(locationName, oClickPoint) {
			this.oCreateChatRoom.style.display = "block";
			//console.log(this.eRoomAddress);
			this.eRoomAddress.innerText = locationName;
			this.oLocationPoint = oClickPoint;
		},
		
		//채팅방 생성창을 닫고, 다른메뉴와의 인터렉션을 할 수 있도록 해주는 함수
		invisible: function() {
			this.oCreateChatRoom.style.display = "none";
		},
		
		initialize: function() {
			
			//element초기화
			this.oCreateChatRoom = document.getElementById('createChatRoom');
			this.eRoomNameInput = this.oCreateChatRoom.querySelector('.roomName');
			this.eLimitNumberInput = this.oCreateChatRoom.querySelector('.limitNum');
			
			//TODO 나중에는 좌표를받아서 서버단에서 해당하는 장소명을 가져오도록 변경해야 합니다.
			this.eRoomAddress = this.oCreateChatRoom.querySelector('.createAddress');
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
			this.eRoomNameInput.value = "";
		},
		
		//채팅방 생성에 대한 요청이벤트 함수
		requestCreate: function(e) {
			e.preventDefault();
			//Validation Check를 위한 form의 데이터가져오기
			var roomNameValue = this.eRoomNameInput.value
			var limitNumValue = parseInt(this.eLimitNumberInput.value, 10);
			
			// WORKING SEHUN
			console.log(this.oLocationPoint);
			oMapClicker.oClickPoint = this.oLocationPoint;
			
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
			var oRequest = {
					"title": roomNameValue,
					"max": ""+limitNumValue,
					//TODO 검색기능 구현전까지의 Temp Data 가져오기. 
					//검색기능 구현 이후, 검색 object에 질의하는 형태로 변경되어야 한다. 
					"locationName": ""+this.eRoomAddress.innerText,
					"locationLatitude": oMapClicker.oClickPoint['y'],
					"locationLongitude": oMapClicker.oClickPoint['x'],
					//TODO 현재의 줌레벨을 넣어야 한다.
					"zoom": oNaverMap.getZoom()
			};
			
			var callback = function(request) {
    			var oResponse = JSON.parse(request.responseText);
    			
    			var isSuccess = oResponse['isSuccess'];
    			var newMarker = oResponse["newMarker"];
    			var markerNumber = newMarker["id"];
    			
    			//console.log("markerNumber : ",markerNumber);
    			
    			if ( isSuccess === true 
    					&& markerNumber !== null 
    					&& markerNumber !== undefined 
    					&& isNaN(markerNumber) === false ) {
    				
    				oNaverMap.updateViewPointMarker(newMarker);
    				
    				//TODO 위의 메소드를 통해 해결하도록, 삭제요망
    				//마커를 생성
    				//oNaverMap.addMarker(oMapClicker.oClickPoint['y'], oMapClicker.oClickPoint['x'], markerNumber, roomNameValue);
    				
    				//TODO oMarker의 타이틀(라벨)을 지역이름으로 저장한다.
    		    	
    		    	//현재 화면에 있는  oMapClicker Element를 보이지 않게 한다.
    		    	oMapClicker.invisible();
    		    	
    		    	//createChatRoom의 input value값들을 초기화한다.
    		    	this.clearRoomNameValue();
    		    	this.clearLimitNumValue();
    		    	
    		    	//현재 포커싱된 createChatRoom  Area를 보이지 않게 한다.
    		    	this.invisible();
    			} else {
    				alert("채팅방 생성에 실패했습니다.\n잠시후 다시 시도해주세요.");
    			} 
			};
			
			//oAjax모듈에게 request요청을 보내고, callback함수를 실행한다.
			oAjax.getObjectFromJsonPostRequest("/chat/create", oRequest, callback.bind(this));
		}
}

/*********************************************************************************************************
 * Create Chat Room 채팅방 생성에 대한 Hidden Area에 대한 소스코드 종료
 **********************************************************************************************************/

/*********************************************************************************************************
 * Marker가 없는 Map클릭시 사용자와 Interaction해야 하는 메뉴에 대한 소스코드 시작
 **********************************************************************************************************/
//초록색 마커 
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
	
	//위치정보를 보여주는 Element
	eLocationName: null,
	//MapClicker 상단에 표기되는 위치정보를 변경한다.
	setLocationName: function(locationName) {
		this.eLocationName.innerText = locationName;
	},
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
		this.eLocationName = this.oMapClicker.querySelector(".locationName div");
		
		
		//초기상태에서는 마커를 노출하지 않기 위해 invisible호출
		this.invisible();

		//mapClicker 메뉴중, plus 버튼을 클릭했을때
		this.clickAdd.addEventListener('click', function(e) {
			oCreateChattingRoom.visible(this.eLocationName.innerText, this.oClickPoint);
		}.bind(this), false);
		
		//mapClicker 메뉴중, star 버튼을 클릭했을때
		this.clickBookMark.addEventListener('click', function(e) {
			alert('clickBookMark');

		
		}, false);
	},	
};

var oKeyboardAction = {
	escPress: function() {
		//채팅방 생성페이지가 열려있을경우, 보이지 않게 처리
		if ( getStyle(oCreateChattingRoom.oCreateChatRoom, "display") !== "none" )
			oCreateChattingRoom.invisible();
	},
	initialize: function() {
		document.onkeydown = function(event) {
			//alert("in : " + event.keyCode);
			if ( event.keyCode == 27 ) {
				this.escPress();
			}
		}.bind(this);
	}	
};

/*********************************************************************************************************
 * Marker가 없는 Map클릭시 사용자와 Interaction해야 하는 메뉴에 대한 소스코드 종료
 **********************************************************************************************************/

/*********************************************************************************************************
* Reverse Geo code 시작 
 **********************************************************************************************************/
//results : 배열로, 클릭한 좌표에 대한 주소 값을 가지고 있다. 0부터 7까지 8개의 주소가 있고,
//가장 상세한 주소는 0번에 저장되어 있고 가장 넓은 범위의 주소(대한민국)은 7번에 저장되어있다.
//status: geocoder의 상태에 대한 값이 저장되어 있다. OK, UNKNOWN_ERROR등이 있다.

var oReverseGeoCode = {
		oGeoCoder: null,
		getAddress: function(latitude, longitude, callback) {
			//console.log("working");
			var clickedLatlng = new google.maps.LatLng(latitude, longitude);
			//callback function get Parameter -> results, status
			this.oGeoCoder.geocode({'latLng': clickedLatlng}, callback);
		},
		initialize: function() {
			this.oGeoCoder = new google.maps.Geocoder();
		}
		//results[0]의 types에 있는 값에 따라 ex)강남역 등만 뽑아올 수도 있음
		//하지만 types가 수십여개인데 그에 따라 나누는 것보다는 naver 검색 API로 돌리는것이 낫지않나싶음
		//문제는, 특정 주소에 대하여 네이버 검색 API를 돌린 값이 nul값... 
		//
		//TODO: 이거 왜 안되는지 알아내서 주소값 받아올 수 있도록 바꿔야됨 
		//아마도 .geocode가 바로 함수를 실행하는 형태이기 때문인듯 
		//그니까 뒤에 function(results,status)이거를 따로 빼서 정의해야할것 같다는 말 으으 
		//console.log("bbb",this.clickedAddress);
};

/*********************************************************************************************************
* Reverse Geo code 끝 
 **********************************************************************************************************/
/*********************************************************************************************************
 * 검색에 대한 소스코드 시작 
 **********************************************************************************************************/
var oSearching = {
		eSubmit: null,
		eSearchBox: null,
		getResultXml: function() {
			var oParameters = {
				"queryKeyword" : document.getElementById("search_box").children[0].value	
			};
			var url = "/search"
			var callback = function(request){
				
				var aResult = JSON.parse(request.responseText); //json을 파싱해서 object로 넣는
				console.log(aResult);
				if(aResult.length == 0){
					oTemplate.showDefaultTemplate("pc_search", ".comment", "검색 결과가 존재하지 않습니다.")
				} else {
					
					//template element가져오기
					var eTemplate = document.getElementById("template").querySelector(".search");			
					//aResult를 for문을 돌며 template element를 복사한 변수를 가져와서 데이터 삽입 
					var eTarget = document.getElementById("pc_search").querySelector("ul");
					//이미 존재하는 검색 결과가 있다면 지운다.
					while (eTarget.firstChild) {
						eTarget.removeChild(eTarget.firstChild);
					}
					
					for( var i = 0 ; i < aResult.length ; ++i){
						var eCopiedTemplate = eTemplate.cloneNode(true);
						var eSearchedTitle = eCopiedTemplate.querySelector(".title");
						var eSearchedCategory = eCopiedTemplate.querySelector(".category");
						var eSearchedAddress = eCopiedTemplate.querySelector(".address");
						
						eSearchedTitle.innerHTML = aResult[i]["title"]; 
						eSearchedCategory.innerText = aResult[i]["category"]; 
						eSearchedAddress.innerText = aResult[i]["address"];
						eCopiedTemplate["cartesianX"] = aResult[i]["mapx"];
						eCopiedTemplate["cartesianY"] = aResult[i]["mapy"];
						
						//template을 원하는 위치에 삽입
						eTarget.appendChild(eCopiedTemplate);
					}
				}
				//검색결과 Panel을 열어준다.
				oAside.clickSearchMenu();
			};
			oAjax.getObjectFromJsonPostRequest(url, oParameters, callback);
		},
		startSearch: function(event){
			if(event.keyCode == 13) {
				this.getResultXml();
			}
		},
		initialize: function() {
			this.eSearchBox = document.getElementById("search_box");
			this.eSubmit = this.eSearchBox.children[1]; 
			this.eSubmit.addEventListener('click', this.getResultXml.bind(this), false);
			this.eSearchBox.addEventListener('keydown', this.startSearch.bind(this), false);
		}
}
/*********************************************************************************************************
 * 검색에 대한 소스코드 종료 
 **********************************************************************************************************/
/*********************************************************************************************************
 * template 객체화 소스코드 시작 
 **********************************************************************************************************/
var oTemplate = {
		//이전에 넣었던 templates 지우기
		deletePreviousTemplate : function(eTarget){
			while(eTarget.firstChild) {
				eTarget.removeChild(eTarget.firstChild);
			}
		},
		showDefaultTemplate: function(targetPosId, targetContentsSelector, sExplanation){
			var eDefaultTemplate = document.getElementById("template").querySelector(".default");
			var eTarget = document.getElementById(targetPosId).querySelector("ul");

			this.deletePreviousTemplate(eTarget);

			var eCopiedDefaultTemplate = eDefaultTemplate.cloneNode(true);
			eCopiedDefaultTemplate.querySelector(targetContentsSelector).innerText = sExplanation;

			eTarget.appendChild(eCopiedDefaultTemplate);
		},
		specifyTemplate : function(aResponse, eDefaultTemplate, eTarget, callback){
			for( var i = 0 ; aResponse.length ; ++i){
				var eCopiedDefaultTemplate = eDefaultTemplate.cloneNode(ture);
				callback(aResponse[i], eDefaultTemplate);
				eTarget.appendChild(eCopiedDefaultTemplate);
			}
		}
};
/*********************************************************************************************************
 * template 객체화 소스코드 종료 
 **********************************************************************************************************/

/*********************************************************************************************************
 * Message 객체에 대한 소스코드 시작
 **********************************************************************************************************/
//working
var Message = function() {
	
};
/*********************************************************************************************************
 * Message 객체에 대한 소스코드 종료
 **********************************************************************************************************/


/*********************************************************************************************************
 * 모두에게 공통되는 초기화 함수영역
 **********************************************************************************************************/
function initialize() {
	
	//------------------------------------------------------------------------------------//
	//네비게이션 초기화영역
	oAside.initialize();
	//------------------------------------------------------------------------------------//
	
	//------------------------------------------------------------------------------------//
	//네이버맵 초기화영역
	oNaverMap.initialize();
	oNaverMap.attachEvents();
	//------------------------------------------------------------------------------------//
	
	//------------------------------------------------------------------------------------//
	//Marker Interaction 메뉴 초기화영역
	oMarkerClicker.initialize();
	//------------------------------------------------------------------------------------//
	
	//------------------------------------------------------------------------------------//
	//MapClicker(마커가 없는 메뉴지역)을 클릭했을때 인터렉션을 위한 객체 초기화
	oMapClicker.initialize();
	//------------------------------------------------------------------------------------//
	
	//------------------------------------------------------------------------------------//
	//Chatting Room Create Area를 위한 초기화 영역
	oCreateChattingRoom.initialize();
	//------------------------------------------------------------------------------------//
	
	//------------------------------------------------------------------------------------//
	//Map 에 위치한 Marker 초기화
	oNaverMap.updateViewPointMarkers();
	//------------------------------------------------------------------------------------//
	
	//------------------------------------------------------------------------------------//
	//검색을 위한  oSearching 초기화 영역
	oSearching.initialize();
	//------------------------------------------------------------------------------------//
	
	//------------------------------------------------------------------------------------//
	//키보드 입력에 대한 Object
	oKeyboardAction.initialize();
	//------------------------------------------------------------------------------------//

	//------------------------------------------------------------------------------------//
	//Reverse GeoCode (위도, 경도를 통한 주소값 추출) 초기화 영역
	oReverseGeoCode.initialize();
	//------------------------------------------------------------------------------------//
	
	//------------------------------------------------------------------------------------//
	//Chatting을 위한  socket.io 초기화 영역
	oChat.initialize();
	//------------------------------------------------------------------------------------//
	
	
	/*
	 * 모든 초기화 작업이후, hidden element를 삭제한다.
	 */
	//------------------------------------------------------------------------------------//
	var aHiddenElement = document.querySelectorAll("input[type=hidden]");
	for ( var index = 0 ; index < aHiddenElement.length ; ++ index ) {
		aHiddenElement[index].remove();
	}
	//------------------------------------------------------------------------------------//
}
