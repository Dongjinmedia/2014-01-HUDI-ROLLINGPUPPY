//전역변수 초기화는 oUtil의 init()에서 한다.
var sBrowserPrefix = null;
var boolIsMobile = false;

var oHeader = {
	eSFWrapper: document.querySelector("#sf_wrapper"),
	eSearchBox: document.querySelector("#searchBox"),
	
	addEvents: function() {
		this.eSearchBox.addEventListener(
				"focus",
				this.focusSearchBox.bind(this)
		);
		
		this.eSearchBox.addEventListener(
				"blur",
				this.blurSearchBox.bind(this)
		);
	},
	
	//TODO expandSearchBox()에 대응되는 CSS 속성 만들 것 
	focusSearchBox: function() {
		oUtil.addClassName(this.eSFWrapper, "onFocus");
	},
	
	blurSearchBox: function() {
		oUtil.removeClassName(this.eSFWrapper, "onFoucs");
	},
	init: function() {
		this.addEvents();
	}
};

//TODO 네비게이션 메뉴 터치에 대응하는 이벤트 핸들러를 만들 것.
//    ** 터치된 네비게이션 메뉴에 .on 추가하기
//    ** 터치된 메뉴의 section을 띄워줄 것
var oNav = {
	aMenu: document.querySelector("#nav_menu").children,
	
	addEvents: function() {
		for (var idx = 0; idx < this.aMenu.length; idx++) {
			this.aMenu[idx].id = "menu" + idx;
			this.aMenu[idx].addEventListener(
					boolIsMobile ? "touchend" : "click",
					this.changePanelPosition.bind(this)
			);
		}
	},
	
	changePanelPosition: function(event) {
		var nClickedPanelIndex = parseInt(event.target.parentNode.id.match(/\d/g)[0]);
		oPanel.setCurrentPanelIndex(nClickedPanelIndex);
		oPanel.setPanelPosition();
	},
	
	setCurrentMenuMarker: function(nCenterIndex) {
		for ( var index = 0 ; index < this.aMenu.length ; ++index ) {
			oUtil.removeClassName(this.aMenu[index], "on");
		};
		
		oUtil.addClassName(this.aMenu[nCenterIndex], "on");
	},
	
	init: function() {
		this.addEvents();
	}
}


/*********************************************************************************************************
 *  
 **********************************************************************************************************/

var oPanel = {
	ePanelButtons: document.querySelector("#panel_buttons"),
	ePanelWrapper: document.querySelector("#panel_wrapper"),
	
	eChattingNotification: document.querySelector("#nav_menu .notification"),
	
	addEvents: function() {
		// panel_buttons 아래 있는 두 개의 button에 대한 클릭 이벤트를 받는다.
		// window에 orientation 속성이 있다면 모바일기기로 판단한다.
		//TODO window.orientation이 모바일 기기의 대표성을 띄는 지 확인해볼 것
		this.ePanelButtons.addEventListener(
				boolIsMobile ? "touchend" : "click",
				this.panelButtonsHandler.bind(this)
		);
		
		// mobile 페이지에서 animation을 정상적으로 종료시키지 않을 경우 성능저하가 발생했습니다.
		// 이에 각 브라우저 별 animationEnd 이벤트 리스너를 달았습니다.
		var sAnimationEnd = "AnimationEnd";
		var sBrowserPrefix = oUtil.getBrowserPrefix();
		
		this.ePanelWrapper.addEventListener(
				sBrowserPrefix === "ms" || sBrowserPrefix === "moz" ?
						sAnimationEnd.toLower() : sBrowserPrefix + sAnimationEnd,
				this.animationEndHandler.bind(this)
		);
		
		this.ePanel.addEventListener(
			"touchstart",
			this.panelTouchStart.bind(this)
		);
		
		this.ePanel.addEventListener(
			"touchmove",
			//this.fnPanelTouchMove
			this.panelTouchMove.bind(this)
		);
		
		this.ePanel.addEventListener(
			"touchend",
			//this.fnPanelTouchEnd
			this.panelTouchEnd.bind(this)
		);
		
		var sTransitionEnd = "TransitionEnd";
		this.ePanel.addEventListener(
				sBrowserPrefix === "ms" || sBrowserPrefix === "moz" ?
						sTransitionEnd.toLower() : sBrowserPrefix + sTransitionEnd,
				this.setPanelPosition.bind(this)
		);
	},

	// paenlButton에 click 혹은 touch 이벤트가 발생하면 실행되는 콜백함수 입니다.
	// panelWrapper의 className를 변경하여 animation 효과를 발생시킵니다.
	panelButtonsHandler : function(event) {
		var rePanelButtons = /panel/g;
		if (rePanelButtons.test(event.target.className) !== true) {
			return;
		}
		
		event.preventDefault();
		var strButtonClassName = event.target.className;

		var boolFold = false;
		if (strButtonClassName === "panelFold"){
			boolFold = true;
		}

		if (boolFold) {
			oUtil.removeClassName(this.ePanelWrapper, "unfoldedPanel");
			oUtil.addClassName(this.ePanelWrapper, "foldPanel");
		} else {
			oUtil.removeClassName(this.ePanelWrapper, "foldedPanel");
			oUtil.addClassName(this.ePanelWrapper, "unfoldPanel");
		}
	},
	
	animationEndHandler: function(event) {
		if (this.ePanelWrapper.className === "unfoldPanel") {
			oUtil.removeClassName(this.ePanelWrapper, "unfoldPanel");
			oUtil.addClassName(this.ePanelWrapper, "unfoldedPanel");
		}
		else if (this.ePanelWrapper.className === "foldPanel") {
			oUtil.removeClassName(this.ePanelWrapper, "foldPanel");
			oUtil.addClassName(this.ePanelWrapper, "foldedPanel");
		}
		else {
			return ;
		}
	},
	
	ePanel: document.querySelector("#panel"),
	ePanelContents: document.querySelector("#panel_contents"),
	aSectionWrapper: document.querySelectorAll(".section_wrapper"),
	
	//현재 화면에 보이는 패널의 인덱스번호
	nCurrentPanelIndex: 0,
	
	//setTimeout에 사용되는 시간값
	nAnimateTime: 0,
	
	//isPanelMove로 터치 이벤트 받을지 말지 판별.
	isPanelMove: false,
	
	//터치시작점 저장
	nTouchStartX: 0,
	nTouchStartY: 0,
	//터치 종료지점 저장
	nTouchEndX: 0,
	nTouchEndY: 0,
	//scroll or swipe를 판별하기 위한 값
	nTotalMoveX: 0,
	nTotalMoveY: 0,
	isScroll: null,
	
	//터치 이벤트 시작시 호출되는 함수
	panelTouchStart: function(event) {
		//TODO IOS에서 링크영역을 잡고 플리킹할때, 플리킹종료 후 링크로 이동되는현상을 막아야 한다.
		if (this.isPanelMove) {
			return;
		}
		
		// 일단 스크롤은 disable 시킵니다. 
		// 뒤에 panelTouchMove에서 스크롤 여부를 판별한 다음 enable 시킵니다.
		window.oScrolls["scroll" + oUtil.mod(this.nCurrentPanelIndex, 4)].disable();
		console.log("panelTouchStart Event : ", event);

		var touch = event.touches[0];
		this.nTouchStartX = touch.pageX;
		this.nTouchStartY = touch.pageY;
		oUtil.removeClassName(this.ePanelContents, "translate");
	},
	
	//터치 이벤트 도중에 호출되는 함수
	panelTouchMove: function(event) {
		if (this.isPanelMove) {
			return;
		}
		
		var touch = event.touches[0];
		this.nTouchEndX = touch.pageX;
		this.nTouchEndY = touch.pageY;
		
		// 터치 시작시점부터 이동된 점들의 총 합을 저장하는 변수
		var nMoveLengthX = this.nTouchEndX - this.nTouchStartX;
		var nMoveLengthY = this.nTouchEndY - this.nTouchStartY;
		
		// nTotalMoveX와 nTotalMoveY를 일정 수준까지 구합니다.
		//    (더 크게 할 수록 정확해지지만, 판별하는 시간동안 로직 수행을 멈춰두기 때문에 시간이 길어집니다)
		if (this.nTotalMoveX + this.nTotalMoveY < 10) {
			this.nTotalMoveX += Math.abs(nMoveLengthX);
			this.nTotalMoveY += Math.abs(nMoveLengthY);
			
			return ;
		}
		
		// nTotalMoveX와 nTotalMoveY를 비교합니다.
		// nTotalMoveX가 크다면 isScroll에 false를, 아니라면 true를 대입합니다.
		//   ** isScroll은 기본값이 null이고, touchEnd 시점에도 null로 초기화 합니다.
		//   ** 따라서 아래 if문은 한 번만 수행되게 되어있습니다.
		if (this.isScroll == null) {
			if( this.nTotalMoveX > this.nTotalMoveY) {
				this.isScroll = false; 
			} else {
				this.isScroll = true;
				// 스크롤을 해도 되는 상황입니다! enable 해줍시다!!
				window.oScrolls["scroll" + oUtil.mod(this.nCurrentPanelIndex, 4)].enable();
			}
		}
		
		// 스크롤을 해야 한다면 플리킹 로직을 실행하지 않고 종료합니다.
		if (this.isScroll) {
			return;
		}

		/* 플리킹 로직 */
		// nMoveLengthX 만큼 좌 우로 이동시킵니다.
		this.ePanelContents.style[oUtil.getBrowserPrefix() + "Transform"] =
				"translate(" + nMoveLengthX + "px)";
	},
	
	//터치가 종료될때 호출되는 함수
	panelTouchEnd: function(event) {
		if (this.isPanelMove) {
			return;
		}
		this.isPanelMove = true;
		
		oUtil.addClassName(this.ePanelContents, "translate");
		console.log("panelTouchEnd Event : ", event);

		var touch = event.changedTouches[0];
		
		this.nTouchEndX = touch.pageX;
		this.nTouchEndY = touch.pageY;
		
		// 초기화 전에 뒤에서 한 번 더 써야 하는 isScroll은 임시변수에 기억합니다
		var tempIsScroll = this.isScroll;
		
		// 변경했던 클래스 변수들을 초기화 합니다.
		this.nTotalMoveX = 0;
		this.nTotalMoveY = 0;
		this.isScroll = null;

		// touchStart에서 disable 했던 스크롤을 풀어둡니다.
		window.oScrolls["scroll" + oUtil.mod(this.nCurrentPanelIndex, 4)].enable();

		if (tempIsScroll) {
			return;
		}
		
		//TODO 변화값은 조절하도록
		var nMoveLengthX = this.nTouchStartX - this.nTouchEndX;
		if (nMoveLengthX > 50) {
			this.ePanelContents.style[sBrowserPrefix + "Transform"] = "translate(-100%)";
			this.nCurrentPanelIndex++;
		} else if (nMoveLengthX < -50) {
			this.ePanelContents.style[sBrowserPrefix + "Transform"] = "translate(100%)";
			this.nCurrentPanelIndex--;
		} else if (nMoveLengthX === 0) {
			this.isPanelMove = false;
		} else {
			this.isPanelMove = false;
			this.ePanelContents.style[sBrowserPrefix + "Transform"] = "translate(0)";
		}
	},
	
	setCurrentPanelIndex: function(idx) {
		this.nCurrentPanelIndex = idx;
	},
	
	//인덱스 값을 확인해 패널의 left속성을 처리하는 함수
	setPanelPosition: function() {
		oUtil.removeClassName(this.ePanelContents, "translate");
		this.ePanelContents.style[sBrowserPrefix + "Transform"] = "translate(0)";

		var nLeftIndex = oUtil.mod(this.nCurrentPanelIndex - 1, 4);
		var nCenterIndex = oUtil.mod(this.nCurrentPanelIndex, 4);
		var nRightIndex = oUtil.mod(this.nCurrentPanelIndex + 1, 4);
		var nRightEndIndex = oUtil.mod(this.nCurrentPanelIndex + 2, 4);
		
		oNav.setCurrentMenuMarker(nCenterIndex);
		
		this.aSectionWrapper[nLeftIndex].style.left = "-100%";
		this.aSectionWrapper[nCenterIndex].style.left = "0%";
		this.aSectionWrapper[nRightIndex].style.left = "100%";
		this.aSectionWrapper[nRightEndIndex].style.left = "200%";

		this.isPanelMove = false;
	},
	
	init : function(){
		this.addEvents();
		// 초기화 시점에 setPanelPosition을 한 번 실행하여 좌측 panel도 만들어 둡니다.
		this.setPanelPosition();
	}
};
/*********************************************************************************************************
 * 스크롤에 대한 소스코드 시작 
 **********************************************************************************************************/
var oScrolls = {
	init: function() {
		for (var idx = 0; idx < 4; idx++) {
			oScrolls["scroll" + idx]
					= new IScroll("#scroll" + idx, { mouseWheel: true });
		}
	}
	
};
/*********************************************************************************************************
 * 스크롤에 대한 소스코드 종료 
 **********************************************************************************************************/


/*********************************************************************************************************
* oPanel안에 Contents영역(리스트)에 대한 소스코드 시작  
**********************************************************************************************************/
var oPanelContents = {
		
		//panel contents 영역
		eChattingListTarget: document.querySelector("#scroll1 ul"),
		eChattingTemplate: document.querySelector("#template .chatRoom"),
		
		addChattingList: function(chatRoomNumber, oTarget) {
			//TODO 변수삭제. 하단부 참조항목들 변경
			var eTemplate = this.eChattingTemplate;
			var eTarget = this.eChattingListTarget;
			
			var eCopiedTemplate = eTemplate.cloneNode(true);
			var eChattingRoomTitle = eCopiedTemplate.querySelector(".title");
			var eChattingRoomMax = eCopiedTemplate.querySelector(".limit");
			var eChattingRoomAddress = eCopiedTemplate.querySelector(".address");
			var eChattingRoomNotification = eCopiedTemplate.querySelector(".notification");
			
		//			"채팅방번호": {
		//				title: "",
		//				locationName: "", 
		//				max: "",
		//				participantNum: "",
		//				unreadMessageNum: "", 
		//				oParticipant: {
		//					"회원아이디": 
		//					{
		//						nickname: "",
		//						TODO 추가데이터
		//					}
		//				}
		//			}
			
			//어차피 oChat의 oInfo에서는 자신에 해당하는 List Element를 자주참조하게된다.
			//그러므로 li element의 주소값을 attribute로 등록한다.
			oChat.oInfo[chatRoomNumber]["eTarget"] = eCopiedTemplate;
			
			//클릭시 이벤트를 처리할 수 있도록 chatRoomNum을 Attribute로 등록한다.
			eCopiedTemplate["chatRoomNumber"] = chatRoomNumber;
			
			eChattingRoomTitle.innerHTML = oTarget["title"]; 
			eChattingRoomMax.innerText = oTarget["participantNum"] +"/"+ oTarget["max"]; 
			eChattingRoomAddress.innerText = oTarget["locationName"];
			oChat.updateNotificationView(chatRoomNumber);
			
			
			//template을 원하는 위치에 삽입
			eTarget.appendChild(eCopiedTemplate);
		},	
};
/*********************************************************************************************************
 * oPanel안에 Contents영역(리스트)에 대한 소스코드 종료  
 **********************************************************************************************************/


/*********************************************************************************************************
 * 검색에 대한 소스코드 시작 
 **********************************************************************************************************/
var oSearching = {
		eSearchBox: document.getElementById("sb_positioner"),
		eSubmit: document.querySelector(".submit"),
		getResultXml: function() {
			var oParameters = {
				"queryKeyword" : this.eSearchBox.children[0].value	
			};
			
			var url = "/search"
			var callback = function(request){
				
				var aResult = JSON.parse(request.responseText); //json을 파싱해서 object로 넣는
				if(aResult.length == 0){
					oTemplate.showDefaultTemplate("pc_search", ".comment", "검색 결과가 존재하지 않습니다.")
				} else {

					//template element가져오기
					var eTemplate = document.getElementById("template").querySelector(".search");			
					//aResult를 for문을 돌며 template element를 복사한 변수를 가져와서 데이터 삽입 
					var eTarget = document.getElementById("scroll0").querySelector("ul");
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
				//oAside.clickSearchMenu();
			};
			oAjax.getObjectFromJsonPostRequest(url, oParameters, callback);
		},

		initialize: function() {
			this.eSubmit.addEventListener('touchend', this.getResultXml.bind(this), false);
		}
}

/*********************************************************************************************************
 * 검색에 대한 소스코드 종료 
 **********************************************************************************************************/

/*********************************************************************************************************
 * 유틸함수 Object 소스코드 시작 
 **********************************************************************************************************/
var oUtil = {
	mod: function (target, division) {
		return ( (target % division) + division ) % division;
	},
	
	addClassName: function(node, strClassName) {
		// 기존에 className가 없던 경우
		if (node.className === "") {
			node.className = strClassName;
			return;
		}
	
	// 기존에 className가 있는 경우 공백문자를 추가하여 넣어줍니다
		node.className += " " + strClassName;
	},
	
	//Node에 특정 className을 제거하는 함수
	removeClassName : function(node, strClassName) {
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
	},
	
	// 브라우저별 prefix를 return해주는 함수
	//    webkitTransition이 있다면 Chrome, Safari
	//    msTransition이 있다면 IE
	//    mozTransition이 있다면 FireFox
	getBrowserPrefix: function() {
		if (typeof document.body.style.webkitTransition !== "undefined") {
			return "webkit";
		} else if (typeof document.body.style.msTransition !== "undefined") {
			return "ms";
		} else if (typeof document.body.style.MozTransition !== "undefined") {
			return "moz";
		} else if (typeof document.body.style.oTransition !== "undefined") {
			return "o";
		} else {
			return "";
		}
	},

	isMobile: function() {
		if (typeof window.orientation !== "undefined") {
			return false;
		}
		return true;
	},
	
	getStyle: function (node, style) {
	    return window.getComputedStyle(node, null).getPropertyValue(style);
	}
};
/*********************************************************************************************************
 * 유틸함수 Object 소스코드 종료 
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
			oChat.oInfo[chatRoomNum]["unreadMessageNum"] = 0;
			
			oChat.updateChatWindowHeaderText(chatRoomNum);
			oChat.updateMemberList(chatRoomNum);
			oChat.updateNotificationView(chatRoomNum);
			oAside.updateTotalNotificationView();
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
				
				oChat.alertNewMessage(oMessageInfo);
				oChat.oInfo[chatRoomNumber]["unreadMessageNum"]++;
				oChat.updateNotificationView(oMessageInfo["tblChatRoomId"]);
				oAside.updateTotalNotificationView();
			}
		},
		
		alertNewMessage: function(oMessageInfo) {
			if ( oMessageInfo["tblMemberId"] !== 0 ) {
				new Message(oMessageInfo);
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
    			if ( aUnreadMessage.length !== 0 ) {
    				
    				//멘트삽입
    				oChat.eChatWindowMessageBox.appendChild(this._getNoticeTemplateCloneElement("여기까지 읽으셨습니다."));
    				var unreadMessageScrollTop = oChat.getMessageBoxScrollTop();
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
			console.log("chattingRoomList :",chattingRoomList);
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
			oChat.oInfo[chatRoomNumber] = oResult;
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
					var eTarget = oPanelContents.eChattingListTarget;
					while (eTarget.firstChild) {
						eTarget.removeChild(eTarget.firstChild);
					}
					
					//for문을 돌면서 Aside의 채팅방리스트에 추가한다.
					for (var key in oResult) {
						if (oResult.hasOwnProperty(key)) {
							oPanelContents.addChattingList(key, oResult[key]);
						}
					}
				}
				//확인하지 않은 메세지갯수를 업데이트한다.
				oPanel.updateTotalNotificationView();
			};
			
			oAjax.getObjectFromJsonPostRequest(incompleteUrl, null, callback.bind(this));
		},
		
		// 채팅방의 top bar를 클릭하면 마우스 이동에 대한 이벤트를 등록한다.
		mouseDownAtChatWindowTopBar: function(e) {
			var sideBarSize = parseInt(oUtil.getStyle(document.getElementById("nav_list"), "width"));
			var headerSize = parseInt(oUtil.getStyle(document.getElementById("header"), "height"));
			var currentChatWindowLeft = parseInt(oUtil.getStyle(this.eChatWindow, "left"));
			var currentChatWindowTop = parseInt(oUtil.getStyle(this.eChatWindow, "top"));
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
		
		init: function() {
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
						oUtil.removeClassName(this, "unfold");
						oUtil.addClassName(this, "fold");
					} else {
						oUtil.removeClassName(this, "fold");						
						oUtil.addClassName(this, "unfold");
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
 * 모두에게 공통되는 초기화 함수영역
 **********************************************************************************************************/
function initialize() {
	sBrowserPrefix = oUtil.getBrowserPrefix();
	boolIsMobile = oUtil.isMobile();

	oScrolls.init();
	oHeader.init();
	oNav.init();
	oPanel.init();
	oSearching.initialize();
	
	oChat.init();
	
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
