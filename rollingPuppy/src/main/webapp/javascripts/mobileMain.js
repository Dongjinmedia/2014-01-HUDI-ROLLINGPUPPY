//전역변수의 초기화는 window.initialize()에서 한다.
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
		oPanel.setCurrentPanelIndex(0);
		oPanel.setPanelPosition();
		
		if (oPanel.isPanelWrapperFolded()) {
			oPanel.unfoldPanelWrapper();
		}
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
		var nMenuLength  = this.aMenu.length;
		for (var idx = 0; idx < nMenuLength ; idx++) {
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
		
		if (oPanel.isPanelWrapperFolded()) {
			oPanel.unfoldPanelWrapper();
		}
	},
	
	setCurrentMenuMarker: function(nCenterIndex) {
		var nMenuLength = this.aMenu.length;
		for ( var index = 0 ; index < nMenuLength ; ++index ) {
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
				this.panelTransitionEnd.bind(this)
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
			this.foldPanelWrapper();
		} else {
			this.unfoldPanelWrapper();
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
	
	foldPanelWrapper: function() {
		oUtil.removeClassName(this.ePanelWrapper, "unfoldedPanel");
		oUtil.addClassName(this.ePanelWrapper, "foldPanel");
	},
	
	unfoldPanelWrapper: function() {
		oUtil.removeClassName(this.ePanelWrapper, "foldedPanel");
		oUtil.addClassName(this.ePanelWrapper, "unfoldPanel");
	},
	
	isPanelWrapperFolded: function() {
		if (this.ePanelWrapper.className === "unfoldedPanel") {
			return false;
		}
		
		return true;
	},
	
	ePanel: document.querySelector("#panel"),
	ePanelContents: document.querySelector("#panel_contents"),
	aSectionWrapper: document.querySelectorAll(".section_wrapper"),
	
	//현재 화면에 보이는 패널의 인덱스번호
	nCurrentPanelIndex: 0,
	
	//setTimeout에 사용되는 시간값
	nAnimateTime: 0,
	
	//isPanelTransition으로 transition 중 추가적인 터치 이벤트 받을지 말지 판별.
	isPanelTransition: false,
	//스크롤인지 스와이프인지 판별
	isScroll: null,
	isPanelAction: false,
	
	//터치시작점 저장
	nTouchStartX: 0,
	nTouchStartY: 0,
	//터치 종료지점 저장
	nTouchEndX: 0,
	nTouchEndY: 0,
	//scroll or swipe를 판별하기 위한 값
	nTotalMoveX: 0,
	nTotalMoveY: 0,
	
	//터치 이벤트 시작시 호출되는 함수
	panelTouchStart: function(event) {
		//TODO IOS에서 링크영역을 잡고 플리킹할때, 플리킹종료 후 링크로 이동되는현상을 막아야 한다.
		if (this.isPanelTransition) {
			return;
		}
		
		// 일단 스크롤은 disable 시킵니다. 
		// 뒤에 panelTouchMove에서 스크롤 여부를 판별한 다음 enable 시킵니다.
		oScroll.disable("panel_scroll" + oUtil.mod(this.nCurrentPanelIndex, 4));
		console.log("panelTouchStart Event : ", event);

		var touch = event.touches[0];
		this.nTouchStartX = touch.pageX;
		this.nTouchStartY = touch.pageY;
		oUtil.removeClassName(this.ePanelContents, "translate");
	},
	
	//터치 이벤트 도중에 호출되는 함수
	panelTouchMove: function(event) {
		if (this.isPanelTransition) {
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
			this.isPanelAction = true;
			if( this.nTotalMoveX > this.nTotalMoveY) {
				this.isScroll = false; 
			} else {
				this.isScroll = true;
				// 스크롤을 해도 되는 상황입니다! enable 해줍시다!!
				window.oScroll.enable("panel_scroll" + oUtil.mod(this.nCurrentPanelIndex, 4));
			}
		}
		
		// 스크롤을 해야 한다면 플리킹 로직을 실행하지 않고 종료합니다.
		if (this.isScroll) {
			return;
		}

		/* 플리킹 로직 */
		// nMoveLengthX 만큼 좌 우로 이동시킵니다.
		this.ePanelContents.style[oUtil.getBrowserPrefix() + "Transform"] =
				"translate3d(" + nMoveLengthX + "px, 0, 0)";
	},
	
	//터치가 종료될때 호출되는 함수
	panelTouchEnd: function(event) {
		if (this.isPanelTransition) {
			return;
		}
		this.isPanelTransition = true;
		
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
		window.oScroll.enable("panel_scroll" + oUtil.mod(this.nCurrentPanelIndex, 4));

		if (tempIsScroll) {
			this.isPanelTransition = false;
			this.isPanelAction = false;
			return;
		}
		
		//TODO 변화값은 조절하도록
		var nMoveLengthX = this.nTouchStartX - this.nTouchEndX;
		if (nMoveLengthX > 50) {
			this.ePanelContents.style[sBrowserPrefix + "Transform"] = "translate3d(-100%, 0, 0)";
			this.nCurrentPanelIndex++;
		} else if (nMoveLengthX < -50) {
			this.ePanelContents.style[sBrowserPrefix + "Transform"] = "translate3d(100%, 0, 0)";
			this.nCurrentPanelIndex--;
		} else if (nMoveLengthX === 0) {
			this.isPanelTransition = false;
		} else {
			this.isPanelTransition = false;
			this.ePanelContents.style[sBrowserPrefix + "Transform"] = "translate3d(0, 0, 0)";
		}
	},
	
	panelTransitionEnd: function() {
		oUtil.removeClassName(this.ePanelContents, "translate");
		this.ePanelContents.style[sBrowserPrefix + "Transform"] = "translate3d(0, 0, 0)";
		
		this.setPanelPosition();

		this.isPanelTransition = false;
		this.isPanelAction = false;
	},
	
	setCurrentPanelIndex: function(idx) {
		this.nCurrentPanelIndex = idx;
	},
	
	//인덱스 값을 확인해 패널의 left속성을 처리하는 함수
	setPanelPosition: function() {
		var nLeftIndex = oUtil.mod(this.nCurrentPanelIndex - 1, 4);
		var nCenterIndex = oUtil.mod(this.nCurrentPanelIndex, 4);
		var nRightIndex = oUtil.mod(this.nCurrentPanelIndex + 1, 4);
		var nRightEndIndex = oUtil.mod(this.nCurrentPanelIndex + 2, 4);
		
		oNav.setCurrentMenuMarker(nCenterIndex);
		
		this.aSectionWrapper[nLeftIndex].style[sBrowserPrefix + "Transform"] = "translate3d(-100%, 0, 0)";
		this.aSectionWrapper[nCenterIndex].style[sBrowserPrefix + "Transform"] = "translate3d(0, 0, 0)";
		this.aSectionWrapper[nRightIndex].style[sBrowserPrefix + "Transform"] = "translate3d(100%, 0, 0)";
		this.aSectionWrapper[nRightEndIndex].style[sBrowserPrefix + "Transform"] = "translate3d(200%, 0, 0)";
	},
	
	// 읽지 않은 메세지갯수 뷰를 업데이트한다.
	updateTotalNotificationView: function() {
		var unreadMessageNum = 0;
		for (var key in oChat.oInfo) {
			if (oChat.oInfo.hasOwnProperty(key)) {
				var oTarget = oChat.oInfo[key];
				unreadMessageNum += parseInt(oTarget["unreadMessageNum"]);
			}
		}
 		
		if ( unreadMessageNum <= 0) {
			this.eChattingNotification.style.display = "none";
		} else {
			this.eChattingNotification.innerText = unreadMessageNum >= 99 ?  "99+" : unreadMessageNum;
			this.eChattingNotification.style.display = "inline-block";
		}
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
var oScroll = {
	disable: function(name) {
		if (typeof this[name] === undefined) {
			this._printError(name);
			return;
		}
		this[name].disable();
	},
	
	enable: function(name) {
		if (typeof this[name] === undefined) {
			this._printError(name);
			return;
		}
		this[name].enable();
	},
	
	refresh: function(name) {
		if (typeof this[name] === undefined) {
			this._printError(name);
			return;
		}
		this[name].refresh();
	},
	
	scrollToBottom: function(name) {
		if (typeof this[name] === undefined) {
			this._printError(name);
			return;
		}
		this[name].scrollTo(0, this[name].maxScrollY);
	},
	
	_printError: function(name) {
		console.log("Can't find \"" + name + "\". Please check the oScroll.init()");
	},
	
	init: function() {
		for (var idx = 0; idx < 4; idx++) {
			oScroll["panel_scroll" + idx]
					= new IScroll("#panel_scroll" + idx, { mouseWheel: true });
		}
		oScroll["chat_scroll"]
				= new IScroll("#chat_scroll", { mouseWheel: true });
		oScroll["marker_scroll"]
				= new IScroll("#marker_scroll", { mouseWheel: true });
	}
};
/*********************************************************************************************************
 * 스크롤에 대한 소스코드 종료 
 **********************************************************************************************************/


/*********************************************************************************************************
* oPanel안에 Contents영역(리스트)에 대한 소스코드 시작  
**********************************************************************************************************/
var oPanelContents = {
		
		
		//template
		eDefaultTemplate: document.querySelector("#template .default"),
		eChattingTemplate: document.querySelector("#template .chatRoom"),
		eBookmarkTemplate: document.querySelector("#template .bookmark"),
		
		//채팅방 패널관련
		eChattingListTarget: document.querySelector("#panel_scroll1 ul"),
		
		//검색 패널관련
		eSearchListTarget: document.querySelector("#panel_scroll0 ul"),
		
		//즐겨찾기 패널관련
		eBookmarkListTarget: document.querySelector("#panel_scroll2 ul"),
		
		
		addChattingList: function(chatRoomNumber, oTarget) {
			var eTemplate = this.eChattingTemplate;
			var eTarget = this.eChattingListTarget;
			
			if (eTarget.querySelector(".comment")) {
				//이미 존재하는 채팅방 목록이 있면 지운다.
				while (eTarget.firstChild) {
					eTarget.removeChild(eTarget.firstChild);
				}
			}
			
			if (eTarget.querySelector(".comment")) {
				var eTarget = this.eChattingListTarget;

				//이미 존재하는 채팅방 목록이 있면 지운다.
				while (eTarget.firstChild) {
					eTarget.removeChild(eTarget.firstChild);
				}
			}
			
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
			
			oScroll.refresh("panel_scroll1");
		},
		
		deleteFromChattingList: function(chatRoomNumber) {
			var eTarget = oChat.oInfo[chatRoomNumber]["eTarget"];
			this.eChattingListTarget.removeChild(eTarget);
			
			if ( this.eChattingListTarget.childNodes.length == 0 ) {
				console.log("test");
				this.vacantChattingList();
			}
			
			oScroll.refresh("panel_scroll1");
		},
		
		vacantChattingList: function() {
			var eDefaultTemplate = this.eDefaultTemplate;			
			var eTarget = this.eChattingListTarget;

			//이미 존재하는 채팅방 목록이 있면 지운다.
			while (eTarget.firstChild) {
				eTarget.removeChild(eTarget.firstChild);
			}
			
			var eCopiedDefaultTemplate = eDefaultTemplate.cloneNode(true);
			eCopiedDefaultTemplate.querySelector(".comment").innerText = "참여중인 채팅방이 없습니다.";
			//template을 원하는 위치에 삽입
			eTarget.appendChild(eCopiedDefaultTemplate);
		},
		
		/*
		 * oBookmark  Schema
		 * 		{
		 * 				id: "",
		 *				locationName: "",
		 * 				locationLatitude: "",
		 * 				locationLongitude: ""
		 * 		}
		 */
		addBookmarkToList: function(oBookmark) {
			var eTemplate = this.eBookmarkTemplate;
			var eTarget = this.eBookmarkListTarget;
			
			if (eTarget.querySelector(".comment")) {
				//이미 존재하는 채팅방 목록이 있면 지운다.
				while (eTarget.firstChild) {
					eTarget.removeChild(eTarget.firstChild);
				}
			}
			
			var bookmarkId = oBookmark["id"];
			var bookmarkName = oBookmark["bookmarkName"]
			var locationName = oBookmark["locationName"];
			var locationLatitude = oBookmark["locationLatitude"];
			var locationLongitude = oBookmark["locationLongitude"];
			
			var eCopiedTemplate = eTemplate.cloneNode(true);
			eCopiedTemplate.querySelector(".title").innerText = bookmarkName;
			eCopiedTemplate.querySelector(".address").innerText = locationName;
			
			//클릭시 이벤트를 처리할 수 있도록 bookmark정보를 attribute로 담는다.
			eCopiedTemplate["id"] = bookmarkId;
			eCopiedTemplate["locationName"] = locationName;
			eCopiedTemplate["locationLatitude"] = locationLatitude;
			eCopiedTemplate["locationLongitude"] = locationLongitude;
			eCopiedTemplate["eTarget"] = eCopiedTemplate;
			
			//template을 원하는 위치에 삽입
			eTarget.appendChild(eCopiedTemplate);
			
			oScroll.refresh("panel_scroll2");
		},
		
		deleteFromBookmarkList: function(eBookmark) {
			this.eBookmarkListTarget.removeChild(eBookmark);
			
			if ( this.eBookmarkListTarget.childNodes.length === 0 ) {
				this.vacantBookmarkList();
			}
			
			oScroll.refresh("panel_scroll2");
		},
		
		vacantSearchList: function() {
			var eDefaultTemplate = this.eDefaultTemplate;			
			var eTarget = this.eSearchListTarget;

			//이미 존재하는 채팅방 목록이 있면 지운다.
			while (eTarget.firstChild) {
				eTarget.removeChild(eTarget.firstChild);
			}
			
			var eCopiedDefaultTemplate = eDefaultTemplate.cloneNode(true);
			eCopiedDefaultTemplate.querySelector(".comment").innerText = "검색결과가 존재하지 않습니다.";
			//template을 원하는 위치에 삽입
			eTarget.appendChild(eCopiedDefaultTemplate);
		},
		
		vacantBookmarkList: function() {
			var eDefaultTemplate = this.eDefaultTemplate;			
			var eTarget = this.eBookmarkListTarget;

			//이미 존재하는 채팅방 목록이 있면 지운다.
			while (eTarget.firstChild) {
				eTarget.removeChild(eTarget.firstChild);
			}
			
			var eCopiedDefaultTemplate = eDefaultTemplate.cloneNode(true);
			eCopiedDefaultTemplate.querySelector(".comment").innerText = "현재 설정된 북마크가 없습니다.";
			//template을 원하는 위치에 삽입
			eTarget.appendChild(eCopiedDefaultTemplate);
		},
		
		//채팅리스트중 하나의 cell을 선택했을 때 실행되는 콜백함수
		chattingSelectHandler: function(event) {
			if (oPanel.isPanelAction) {
				return;
			}
			
			console.log("into chattingSelectHandler");
			var clickedTarget = event.target;
			var destinationTarget = null;
			
			if (clickedTarget.tagName != "P" && clickedTarget.tagName != "LI") {
				return;
			}
			
			//cell을 선택했으면 
			//현재, cell의 속성으로 좌표를 넣어두었다. 따라서 태그의 부모노드인 cell을 찾아서 
			//그 cell의 속성으로 저장된 채팅방번호를 가져온다.
			if(clickedTarget.tagName == "P"){
				destinationTarget = clickedTarget.parentNode;
			} else {
				destinationTarget = clickedTarget;
			}
			var chatRoomNum = destinationTarget["chatRoomNumber"];
			
			oChat.showChatWindow(chatRoomNum);
		},

		//관심장소리스트중 하나의 cell을 선택했을 때 실행되는 콜백함수
		//working
		bookmarkSelectHandler: function(event) {
			if (oPanel.isPanelAction) {
				return;
			}
			var destinationTarget = null;
			var clickedTarget = event.target;
			var clickedTagName = clickedTarget.tagName;
			
			if ( clickedTagName == "P" || clickedTagName == "I") {
				destinationTarget = clickedTarget.parentNode;
			} else if (clickedTagName == "LI") {
				destinationTarget = clickedTarget;
			} else {
				return;
			}
			
			//cell을 선택했으면 
			//현재, cell의 속성으로 bookmark 지역명, 좌표, 대상 element 주소값을 넣어두었다. 
			var bookmarkId = destinationTarget["id"];
			var bookmarkName = destinationTarget["bookmarkName"]
			var locationName = destinationTarget["locationName"];
			var locationLatitude = destinationTarget["locationLatitude"];
			var locationLongitude = destinationTarget["locationLongitude"];
			
			if ( clickedTagName == "I" ) {

				var oParameters = {
	    			"bookmarkId": bookmarkId
	    		};
	    		
	    		var callback = function(request) {
	    			var oResponse = JSON.parse(request.responseText);
	    			console.log(oResponse);
	    			var isSuccess = oResponse['isSuccess'];

	    			if ( isSuccess ) {
	    				oPanelContents.deleteFromBookmarkList(destinationTarget["eTarget"]);
	    			} else {
		    			alert("북마크삭제에 실패했습니다.\n잠시후 다시 시도해주세요.");
		    		}
	    		}
	    		
	    		oAjax.getObjectFromJsonPostRequest("/bookmark/delete", oParameters, callback.bind(this));
				
			} else {
				var oPoint = new nhn.api.map.LatLng(locationLatitude, locationLongitude);
				//찾은 좌표로 지도의 중심을 재설정한다. 
				oNaverMap.oMap.setCenter(oPoint);
				//결과를 명확하게 하기 위해 zoomlevel을 키운다 . 
				oNaverMap.oMap.setLevel(13);
			}
			//working
			
			oPanel.foldPanelWrapper();
		},
		
		//검색 결과 중 하나의 cell을 선택했을 때 실행되는 콜백함수 
		searchSelectHandler: function(event){
			if (oPanel.isPanelAction) {
				return;
			}
			
			//만약 검색결과가 없어서 default영역이 panelContent안에 존재할 경우
			if (this.eSearchListTarget.querySelector(".comment")) {
				return;
			}
			
			var clickedTarget = event.target;
			//현재 하나의 cell은 세개의 p태그로 이루어져있다.
			//그런데, cell이외의 page부분은 li태그로 이루어져있으므로 p태그인지 아닌지를 확인하는것이 cell을 선택했는지 여부의 척도가 될 수 있다.
			if (clickedTarget.tagName != "P" && clickedTarget.tagName != "LI") {
				return;
			}

			//cell을 선택했으면 
			//현재, cell의 속성으로 좌표를 넣어두었다. 따라서 태그의 부모노드인 cell을 찾아서 
			//그 cell의 속성으로 저장된 좌표를 불러온다. 
			var destinationTarget = null;			
			if(clickedTarget.tagName == "P"){
				destinationTarget = clickedTarget.parentNode;
			} else {
				destinationTarget = clickedTarget;
			}
			
			var destinationCartesianX = destinationTarget["cartesianX"];
			var destinationCartesianY = destinationTarget["cartesianY"];
			//검색 결과에서 주는 좌표는 우리가 이제껏 받아온 위도 경도가 아니라 카텍좌표계이다.
			var oPoint = new nhn.api.map.TM128(destinationCartesianX, destinationCartesianY);
			//찾은 좌표로 지도의 중심을 재설정한다. 
			oNaverMap.oMap.setCenter(oPoint);
			//결과를 명확하게 하기 위해 zoomlevel을 키운다 . 
			oNaverMap.oMap.setLevel(13);
			//이동한 장소의 Marker정보를 업데이트합니다.
			oNaverMap.updateViewPointMarkers();

			oPanel.foldPanelWrapper();
		},
		
		init: function() {
			//검색패널 리스트 클릭시 호출되는 이벤트 등록
			this.eSearchListTarget.addEventListener("touchend", this.searchSelectHandler.bind(this));
			
			//채팅패널 리스트 클릭시 호출되는 이벤트 등록
			this.eChattingListTarget.addEventListener("touchend", this.chattingSelectHandler.bind(this));
			
			//즐겨찾기 리스트 클릭시 호출되는 이벤트 등록
			this.eBookmarkListTarget.addEventListener("touchend", this.bookmarkSelectHandler.bind(this));
		}
};
/*********************************************************************************************************
 * oPanel안에 Contents영역(리스트)에 대한 소스코드 종료  
 **********************************************************************************************************/


/*********************************************************************************************************
 * 검색에 대한 소스코드 시작 
 **********************************************************************************************************/
var oSearching = {
		eSearchBox: document.querySelector("#searchBox"),
		eSubmit: document.querySelector(".submit"),
		getResultXml: function() {
			var oParameters = {
				"queryKeyword" : this.eSearchBox.value	
			};
			
			var url = "/search"
			var callback = function(request){
				
				var aResult = JSON.parse(request.responseText); //json을 파싱해서 object로 넣는
				if(aResult.length == 0){
					oPanelContents.vacantSearchList();
				} else {

					//template element가져오기
					var eTemplate = document.getElementById("template").querySelector(".search");			
					//aResult를 for문을 돌며 template element를 복사한 변수를 가져와서 데이터 삽입 
					var eTarget = document.getElementById("panel_scroll0").querySelector("ul");
					//이미 존재하는 검색 결과가 있다면 지운다.
					while (eTarget.firstChild) {
						eTarget.removeChild(eTarget.firstChild);
					}
					
					var nResultLength = aResult.length; 
					for( var i = 0 ; i <  nResultLength ; ++i){
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
						
						//스크롤 영역 크기 조절
						oScroll.refresh("panel_scroll0");
						oPanel.setCurrentPanelIndex(0);
						oPanel.setPanelPosition();
					}
				}
				//검색결과 Panel을 열어준다.
				//oPanelContents.clickSearchMenu();
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
	
	addClassName: function (node, strClassName) {
		// 기존에 className가 없던 경우
		if (node.className === "") {
			node.className = strClassName;
			return ;
		}
		
		// node에 className가 존재하는 경우
		if (node.className.toString().search(strClassName) !== -1) {
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
			return true;
		}
		return false;
	},
	
	getStyle: function (node, style) {
	    return window.getComputedStyle(node, null).getPropertyValue(style);
	}
};
/*********************************************************************************************************
 * 유틸함수 Object 소스코드 종료 
 **********************************************************************************************************/

/*********************************************************************************************************
 * 네이버맵 API관련 소스코드 시작
 **********************************************************************************************************/
var oNaverMap = {
		//working
		naverMap: document.getElementById("naver_map"), //Main Page에서 Map영역에 해당하는  div객체
	    oCenterPoint: null, //지도 중심으로 포커싱할 위치를 저장하는 객체 (LatLng 좌표사용)
	    oMap: null, //맵옵션을 모두 저장하고 있는 지도의 기본이 되는 객체
	    oIcon: null,
	    oIcons: null,
	    
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

	    // 원하는 동작을 구현한 이벤트 핸들러를 attach함수로 추가.
	    // void attach( String sEvent, Function eventHandler) 이벤트명,  이벤트 핸들러 함수
	    attachEvents : function(){
	    	this.oMap.attach("dragstart",this.dragStartEvent.bind(this));
	        this.oMap.attach("dragend",this.dragEndEvent.bind(this));
	        this.oMap.attach("click", this.clickEvent.bind(this));
	    },

	    //move event가 발생한 후 click이벤트가 발생한다.
	    //drag 시작할 때 mapClickWithoutMarker를 화면상에서 보이지 않게끔 처리한다.
	    dragStartEvent : function(oCustomEvent){
	    	console.log("clickstart");
	        oMapClicker.invisible();
	    },

	    //TODO 네트워크 비용을 낮추기위해 내부적으로 현재 좌표이동을 체크하는 로직이 필요하다. (현재는 클릭만해도 동작)
	    //TODO Drag를 위한 최소단위 설정을 고려해보자.
	    dragEndEvent: function(oCustomEvent) {
	    	console.log("dragEnd");
	    	this.updateViewPointMarkers();
	    },
	    
	    clickEvent: function(oCustomEvent) {

	    	var oTarget = oCustomEvent.target;

	    	// 마커 클릭하면
	        if (oTarget instanceof nhn.api.map.Marker) {
	            	
	        	// - 현재 우리 프로젝트에서는 하나의 엘리먼트를 각각 클릭마다 업데이트하여 사용하고 있습니다.
	        	//새로 클릭한 마커는, 고유 마커의 정보를 담고 있어야 합니다.
	        	//새로운 마커정보를 담아 상세페이지를 보이게 설정합니다.
	        	oMarkerClicker.setVisible(oTarget.markerNumber)
	        	
	        } else {
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
	        			} else {
	                		console.log("reverseGeoCode status not fine ");
	                	}
	                };
	        	}
	        	oReverseGeoCode.getAddress(oCustomEvent.point.y, oCustomEvent.point.x, callback);
	        }
	    },

	    init: function() {
	        var mapDivWidth = oUtil.getStyle(this.naverMap, "width");
	        var mapDivHeight = oUtil.getStyle(this.naverMap, "height");
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
	        
	         //네이버에서 자동으로 생성하는 지도 맵  element의 크기자동조절을 위해 %값으로 변경한다. (naver_map하위에 생긴다)
	        var eNmap = document.getElementsByClassName("nmap")[0];
	        eNmap.style.cssText = "width:100%;height:100%;";
	        
	        //setSize를 이용해서 변경을 하면 화면이 전부 날아가는 현상이 발생함..
	        //this.oMap.setSize(new nhn.api.map.Size(this.mapDivWidth, this.mapDivHeight));
	        
	        //메모리상에 현재 화면에 존재하는 마커정보를 담기위한 Object 선언
	        //맵 드래그, 데이터 업데이트 등을 수행할때
	        //이미 맵에 추가된 마커는 정보만 업데이트 하는 등을 판별하기 위해서 필요하다.
	        this.oCurrentViewPointMarkers = {};
	        
	        this.attachEvents();
	    }
};

/*********************************************************************************************************
 * 네이버맵 API관련 소스코드 끝
 **********************************************************************************************************/


/*********************************************************************************************************
 * Marker Interaction 메뉴 소스코드 시작
 **********************************************************************************************************/
//채팅방이 생성되어있는 marker를 눌렀을 때 나오는 상세페이지에 대한 Object 
var oMarkerClicker = { 
	
	rootElement: document.querySelector("#markerInfo"),
	eMarkerAddress: document.querySelector("#markerInfo .address"),	
	eChatRoomListTarget: document.querySelector("#markerInfo .mi_chatRoomList ul"),  
	eFoldButton: document.querySelector("#markerInfo .mi_foldButton"),
	
	eAddBookmark: document.querySelector("#markerInfo .mi_bookmarkButton"),
	eCreateChatRoom: document.querySelector("#markerInfo .mi_addChatRoomButton"), 
	
	oCurrentMarkerPoint: null,
	
	init: function() {
		//관심장소 추가하기
		this.eAddBookmark.addEventListener("touchend", oBookmark.addBookmark);
		
		//채팅방 생성하기
		this.eCreateChatRoom.addEventListener(
				"touchend", function() {
					oMarkerClicker.setInvisible();
					oCreateChattingRoom.visible(
							this.eMarkerAddress.innerText,
							this.oCurrentMarkerPoint);
				}.bind(this)
		);
		
		//뒤로버튼
		this.eFoldButton.addEventListener("touchend", oMarkerClicker.setInvisible.bind(this));
		
		//채팅방 리스트 클릭시 이벤트
		this.eChatRoomListTarget.addEventListener("touchend", function(e) {
			if(oMarkerInfo.isScroll) {
				return;
			}
			
			var clickedTarget = event.target;
			if (clickedTarget.tagName != "P" && clickedTarget.tagName != "LI") {
				return;
			}
			
			var destinationTarget = null;
			
			if(clickedTarget.tagName == "P"){
				destinationTarget = clickedTarget.parentNode;
			} else {
				destinationTarget = clickedTarget;
			}
			
			var chatRoomNum = destinationTarget["chatRoomNumber"];
			console.log("chatRoomNumber : ", chatRoomNum);
			oChat.enterChatRoom(chatRoomNum);
			
		}.bind(this));
	},
	
	// Ajax통신을 통해 마커 안에 있는 채팅방들의 현재 채팅 인원 수를 가져와 리턴하는 메서드
	getCurrentNumOfParticipantByAjax: function(chatRoomNumber) {
		var incompleteUrl = "/markerClicker/getCurrentNumOfParticipant";
		var oParameter = {
			"chatRoomNumber": chatRoomNumber
		};
		var currentNumOfParticipants = null;
		
		var callback = function(request) {
			//if (typeof request === "object")
			this.currentNumOfParticipants = JSON.parse(request.responseText);
		};
		
		oAjax.getObjectFromJsonGetRequest(incompleteUrl, oParameter, callback.bind(this));
		
		return this.currentNumOfParticipants;
	},

	//사용자가 새로 클릭한 마커에 대한 정보를, 마커 인터렉션 창에 업데이트 시켜주는 함수이다.
	//예를들어 채팅방목록, 장소 정보 등등
	setVisible: function(markerNumber) {
		
		this.rootElement.style.display = "inline-block";
		
		//메모리에 존재하는 마커정보를 가져온다.
		//현재 마커 아이디를 토대로, 
		//맵뷰상에 존재하는 메모리를 저장하고 있는 oCurrentViewPointMarkers 에서 가져온다.
		var oMarkerInfo = oNaverMap.oCurrentViewPointMarkers[markerNumber];
		//마커정보를 담고있는 Object에서 마커에 해당하는 chatRoom정보들을 담고있는 Array를 가져온다.
		var aChatRoomInMarker = oMarkerInfo["chatRooms"];
		var nChatRoomInMarkerLength = aChatRoomInMarker.length;
		
		//현재 클릭된 장소에 대한 MarkerPointer를 업데이트해준다.
		//이는 "채팅방 생성"시 필요한 정보이다.
		this.oCurrentMarkerPoint = {
				"y": oMarkerInfo["location_latitude"],
				"x": oMarkerInfo["location_longitude"]
		}
		
		//marker 장소 정보를 업데이트
		this.eMarkerAddress.innerText = oMarkerInfo["location_name"];
		
		var eTemplate = oPanelContents.eChattingTemplate;
		var eTarget = this.eChatRoomListTarget;
		
		for ( var index = 0 ; index < nChatRoomInMarkerLength ; ++index ) {
			var newChatRoom = aChatRoomInMarker[index];
			console.log("newChatRoom : ",newChatRoom);
			//TODO 변경
			//채팅방의 현재 참여 인원을 Ajax 통신을 통해 가져온다.
			var currentParticipant = this.getCurrentNumOfParticipantByAjax(newChatRoom["id"]);
			
			var eCopiedTemplate = eTemplate.cloneNode(true);
			eCopiedTemplate["chatRoomNumber"] = newChatRoom["id"];
			eCopiedTemplate.querySelector(".title").innerText = newChatRoom["title"];
			eCopiedTemplate.querySelector(".limit").innerText = currentParticipant + "/" +newChatRoom["max"];;
			this.eChatRoomListTarget.appendChild(eCopiedTemplate);
		}
		
		oScroll.refresh("marker_scroll");		
	},
	
	setInvisible: function() {
		this.rootElement.style.display = "none";
		var eTarget = this.eChatRoomListTarget;
		
		while (eTarget.firstChild) {
			eTarget.removeChild(eTarget.firstChild);
		}
	},
}
/*********************************************************************************************************
 * Marker Interaction 메뉴에 대한 소스코드 끝
 **********************************************************************************************************/

var oMarkerInfo = {
	eChatRoomList: document.querySelector(".mi_chatRoomList"),
	isScroll: false,
	
	addEvents: function() {
		this.eChatRoomList.addEventListener(
				"touchstart",
				this.listTouchStart.bind(this)
		);
		
		this.eChatRoomList.addEventListener(
				"touchmove",
				this.listTouchMove.bind(this)
		);
		
		this.eChatRoomList.addEventListener(
				"touchend",
				this.listTouchEnd.bind(this)
		);
	},
	
	listTouchStart: function(evnet) {
		this.isScroll = false;
		oScroll.disable("marker_scroll");
	},
	
	listTouchMove: function(event) {
		if (this.isScroll == false) {
			this.isScroll = true;
			oScroll.enable("marker_scroll");
		}
	},
	
	listTouchEnd: function(event) {
		oScroll.enable("marker_scroll");
	},
	
	init: function() {
		this.addEvents();
	}
}


/*********************************************************************************************************
* Reverse Geo code 시작 
 **********************************************************************************************************/
//results : 배열로, 클릭한 좌표에 대한 주소 값을 가지고 있다. 0부터 7까지 8개의 주소가 있고,
//가장 상세한 주소는 0번에 저장되어 있고 가장 넓은 범위의 주소(대한민국)은 7번에 저장되어있다.
//status: geocoder의 상태에 대한 값이 저장되어 있다. OK, UNKNOWN_ERROR등이 있다.

var oReverseGeoCode = {
		oGeoCoder: null,
		getAddress: function(latitude, longitude, callback) {
			var clickedLatlng = new google.maps.LatLng(latitude, longitude);
			//callback function get Parameter -> results, status
			this.oGeoCoder.geocode({'latLng': clickedLatlng}, callback);
		},
		init: function() {
			this.oGeoCoder = new google.maps.Geocoder();
		}
		//results[0]의 types에 있는 값에 따라 ex)강남역 등만 뽑아올 수도 있음
		//하지만 types가 수십여개인데 그에 따라 나누는 것보다는 naver 검색 API로 돌리는것이 낫지않나싶음
		//문제는, 특정 주소에 대하여 네이버 검색 API를 돌린 값이 nul값... 
		//
		//TODO: 이거 왜 안되는지 알아내서 주소값 받아올 수 있도록 바꿔야됨 
		//아마도 .geocode가 바로 함수를 실행하는 형태이기 때문인듯 
		//그니까 뒤에 function(results,status)이거를 따로 빼서 정의해야할것 같다는 말 으으 
};

/*********************************************************************************************************
* Reverse Geo code 끝 
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
		eSendButton: document.querySelector("#chatWindow .send"),
		
		//채팅창 안의 element
		eChatWindowTopBar: document.querySelector("#chatWindow .top"),
		eChatWindowTitle: document.querySelector("#chatWindow .top .title"),
		eChatWindowMessageBox: document.querySelector("#chatWindow .middle .chattingContents"),
		
		//채팅방 참여자 리스트
		eMemberIcon : document.querySelector("#chatWindow .top .menu .icon-member"),
		eRightArea: document.querySelector("#chatWindow .rightArea"),
		
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
				//자세한 내용은 initializeChatRoomListInPanelAndSaveChatInfo 함수를 참조하자.
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
			console.log("into showChatWindow");
			
			console.log("oChat.oInfo : ",oChat.oInfo);
			
			oChat.saveCurrentChatRoomNumber(chatRoomNum);
			oChat.oInfo[chatRoomNum]["unreadMessageNum"] = 0;
			
			oChat.updateChatWindowHeaderText(chatRoomNum);
			oChat.updateMemberList(chatRoomNum);
			oChat.updateNotificationView(chatRoomNum);
			oPanel.updateTotalNotificationView();
			oChat.visibleChatWindow();
			
			//scrollHeight설정은 chatWindow가 보여질때만이 속성값 변경이 가능하다. 
			//때문에 가장 마지막에 실행해준다.
			oChat.updateInitializeMessage(chatRoomNum);

			oScroll.refresh("chat_scroll");
			this.eInputBox.blur();
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
		
		//채팅방 참여자 리스트보기 메뉴를 클릭할때 실행되는 함수
		memberPanelHandler: function() {
			if ( this.eRightArea.className.indexOf("unfold") !== -1 ) {
				this.foldMemberPanel();
			} else {
				this.unfoldMemberPanel();
			}					
		},
		
		foldMemberPanel: function() {
			oUtil.removeClassName(this.eRightArea, "unfold");
			oUtil.addClassName(this.eRightArea, "fold");
		},
		
		unfoldMemberPanel: function() {
			oUtil.removeClassName(this.eRightArea, "fold");						
			oUtil.addClassName(this.eRightArea, "unfold");
		},
		
		saveCurrentChatRoomNumber: function(chatRoomNum) {
			this.currentChatRoomNumber = chatRoomNum;
			this.socket.emit("saveCurrentChatRoomNumber", {"currentChatRoomNumber": chatRoomNum});
		},
		
		sendMessage: function(message) {
			
			if ( message.length === 0 ) {
				return;
			}
			
			oMessageInfo = {
				"message": message,
				"chatRoomNumber": this.currentChatRoomNumber,
			};
			
			this.socket.emit('message', oMessageInfo);
			this.eInputBox.value = "";
			this.eInputBox.blur();
			this.eInputBox.focus();
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
				oPanel.updateTotalNotificationView();
			}
		},
		
		alertNewMessage: function(oMessageInfo) {
			if ( oMessageInfo["tblMemberId"] !== 0 ) {
				new Message(oMessageInfo);
			}
		},
		setMessageBoxScrollTop: function() {
			// TODO IScroll을 사용함에 따라 동작하지 않을 것. 
			this.eChatWindowMessageBox.scrollTop = this.eChatWindowMessageBox.scrollHeight;
		},
		
		getMessageBoxScrollTop: function() {
			// TODO IScroll을 사용함에 따라 동작하지 않을 것. 
			return this.eChatWindowMessageBox.scrollHeight;
		},
		
		updateMessageBoxScrollTop: function(height) {
			// TODO IScroll을 사용함에 따라 동작하지 않을 것. 
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
			
			if ( chatRoomNum == 0 || memberId == 0 || message == null || time == null )
				return;
			
			var oMemberInfo = oChat.oInfo[chatRoomNum]["oParticipant"][memberId];
			
			//나간멤버에 대한 메세지데이터일 경우, 
			//TODO Best Solution은 아닙니다. 수정해야해요 <윤성>
			if (typeof oMemberInfo == "undefined") {
				var oParameters = {
		    			"memberId": memberId
		    	};
		    		
	    		var callback = function(request) {
	    			var oResponse = JSON.parse(request.responseText);
	    			console.log(oResponse);
	    			if ( oResponse ) {
	    				
	    				//working
	    				oChat.addNicknameToChatInfo(chatRoomNum, memberId, oResponse);
	    				//oChat.oInfo[chatRoomNum]["oParticipant"][memberId] =
	    				
	    				var eCopiedTemplate = oChat.eTemplateOther.cloneNode(true);
	    				
	    				
	    				eCopiedTemplate.querySelector(".nickname").innerText = oResponse["nicknameAdjective"] +" "+ oResponse["nicknameNoun"];
	    				eCopiedTemplate.querySelector(".message").innerText = message;
	    				eCopiedTemplate.querySelector(".time").innerText = time;
	    				
	    				var eTargetProfile = eCopiedTemplate.querySelector(".profile"); 
	    				eTargetProfile.style.backgroundColor= oResponse["backgroundColor"];
	    				eTargetProfile.style.backgroundImage="url("+oResponse["backgroundImage"]+")";
	    				
	    				return eCopiedTemplate;
	    			} else {
	    				alert("잘못된 접근입니다.\n다시입장해 주세요.");
	    				oChat.invisibleChatWindow();
		    		}
	    		}
		    		
		    	oAjax.getObjectFromJsonGetRequest("/getNickname", oParameters, callback.bind(this));
			} else {
				var eCopiedTemplate = oChat.eTemplateOther.cloneNode(true);
				
				
				eCopiedTemplate.querySelector(".nickname").innerText = oMemberInfo["nicknameAdjective"] +" "+ oMemberInfo["nicknameNoun"];
				eCopiedTemplate.querySelector(".message").innerText = message;
				eCopiedTemplate.querySelector(".time").innerText = time;
				
				var eTargetProfile = eCopiedTemplate.querySelector(".profile"); 
				eTargetProfile.style.backgroundColor= oMemberInfo["backgroundColor"];
				eTargetProfile.style.backgroundImage="url("+oMemberInfo["backgroundImage"]+")";
				
				return eCopiedTemplate;
			}
			
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
			
			// TODO 기존의 -scrollTop 함수를 어떻게 처리할 지 결정할 것!
			this.setMessageBoxScrollTop();
			oScroll.refresh("chat_scroll");
			oScroll.scrollToBottom("chat_scroll");
		},
		
		updateLastMessageDayNum: function(nDay) {
			this.lastMessageDayNum = nDay;
		},
		
		updateOneMessage: function(aMessage) {
			
			if ( aMessage == undefined 
					|| aMessage == null 
					|| aMessage.length === 0 )
				return;
			
			var nMessageLength = aMessage.length;
			for ( var index = 0 ; index < nMessageLength ; ++ index ) {
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
		},
		
		//패널의 채팅리스트에 존재하는 채팅방의 Notification VIew를 업데이트한다.
		updateNotificationView: function(chatRoomNum) {
			var oTarget = this.oInfo[chatRoomNum];
			var eChattingRoomNotification = oTarget["eTarget"].querySelector(".notification");
			
			var unreadMessageNum = oTarget["unreadMessageNum"];
			
			if ( unreadMessageNum === 0 ) {
				eChattingRoomNotification.style.display = "none";
	 		} else {
	 			eChattingRoomNotification.innerText = (unreadMessageNum >= 99 ) ? "99+" : unreadMessageNum ;
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
		
		//새로운 chatInfo항목을 추가한다.
		addChatInfo: function(chatRoomNumber, oResult) {
			oChat.oInfo[chatRoomNumber] = oResult;
		},
		
		//chatInfo를 초기화한다.
		saveChatInfo: function(oParameter) {
			window.oChat.oInfo =  oParameter;
		},
		
		//chatInfo를 초기화한다.
		addNicknameToChatInfo: function(chatRoomNumber, memberId, oParticipant) {
			//window.oChat.oInfo =  oParameter
			oChat.oInfo[chatRoomNumber]["oParticipant"][memberId] = oParticipant;
		},

		
		/*
		 * 초기화때 1번 수행되는 함수입니다.
		 * 채팅에서 가장 중요한 데이터들을 oInfo에 저장하고, 채팅방리스트를 업데이트합니다.
		 */
		initializeChatRoomListInPanelAndSaveChatInfo: function(){
			var eEnteredChatInfoObject = document.getElementById("enteredChatInfoObject");

			if ( eEnteredChatInfoObject == null || eEnteredChatInfoObject == undefined)
				return;
			
			var oEnteredChatInfo = JSON.parse(eEnteredChatInfoObject.innerText);
			 
		 	//oInfo에 요청데이터를 저장
		 	this.saveChatInfo(oEnteredChatInfo);
		 	
		 	//for문을 돌면서 Aside의 채팅방리스트에 추가한다.
		 	for (var key in oEnteredChatInfo) {
		 		if (oEnteredChatInfo.hasOwnProperty(key)) {
		 			oPanelContents.addChattingList(key, oEnteredChatInfo[key]);
		 		}
		 	}
		 
		 	//확인하지 않은 메세지갯수를 업데이트한다.
		 	oPanel.updateTotalNotificationView();
			oScroll.refresh("panel_scroll1");
		},
		
		init: function() {
			var email = document.getElementById("email").innerText;
			//hidden attribute. User Identifier Database id Value.
			//TODO 설정탭의 개인정보 수정과 함께 처리되어야 할 여지가 있다.
			this.userId = document.getElementById("id").innerText;
			
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
			
			// send 버튼을 누르면 메세지를 보냅니다
			this.eSendButton.addEventListener(
					"touchend",
					function(event){
						console.log(this.eInputBox.value);
						this.sendMessage(this.eInputBox.value);
					}.bind(this)
			);
			
			
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
//			this.eRightArea.addEventListener('click', function(e) {
//				
//				//element 외의 영역을 클릭하는것이기 떄문에 before, after항목을 클릭한 경우이다.
//				if ( e.offsetX > this.offsetWidth) {
//					
//					if ( e.target.className.indexOf("unfold") !== -1 ) {
//						oUtil.removeClassName(this, "unfold");
//						oUtil.addClassName(this, "fold");
//					} else {
//						oUtil.removeClassName(this, "fold");						
//						oUtil.addClassName(this, "unfold");
//					}					
//				}
//			}, false);
			
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
			this.initializeChatRoomListInPanelAndSaveChatInfo();
			
			//채팅방 참여자리스트에서 보기메뉴를 클릭할때 발생하는 이벤트
			this.eMemberIcon.addEventListener("touchend",this.memberPanelHandler.bind(this));
		}
};
/*********************************************************************************************************
 * Chatting에 대한 소스코드 종료
 **********************************************************************************************************/

/*********************************************************************************************************
 * Marker가 없는 Map클릭시 사용자와 Interaction해야 하는 메뉴에 대한 소스코드 시작
 **********************************************************************************************************/
//초록색 마커 
var oMapClicker = {
	//MapClickerk 전체 Element. 
	eMapClicker: document.getElementById('mapClicker'),
	
	//Add버튼에 해당하는 Element.
	ePlus: document.querySelector('#mapClicker .icon-add'),
	
	//즐겨찾기 버튼에 해당하는 Element.
	ePin: document.querySelector('#mapClicker .icon-star'),
	
	//naverMap에서 클릭된 지점에 대한 Point Object를 저장하는 변수.
	oClickPoint: null,
	
	//위치정보를 보여주는 Element
	eLocationName: document.querySelector("#mapClicker .locationName div"),
	
	//Memory Data
	//마지막으로 클릭한 x,y 정보를 담은 Object
	oClickPoint: null,
	//마지막으로 클릭한 지역명을 담은 String Value
	sClickLocationName: null,
	
	//MapClicker 상단에 표기되는 위치정보를 변경한다.
	setLocationName: function(locationName) {
		this.eLocationName.innerText = locationName;
		this.sClickLocationName = locationName;
	},
	//Client width, height값을 계산해서 위치를 변경한다.
	move: function(clientPosX, clientPosY) {
		this.eMapClicker.style.left = clientPosX+'px';
		this.eMapClicker.style.top = clientPosY +'px';
	},
	//click element가 보이지 않도록 하는 함수
	invisible: function() {
		this.eMapClicker.style.top = "-2000px";
	},
	//click element 초기화 함수
	init: function() {
		
		//초기상태에서는 마커를 노출하지 않기 위해 invisible호출
		this.invisible();

		//working
		//mapClicker 메뉴중, plus 버튼을 클릭했을때
		this.ePlus.addEventListener('click', function() {
			console.log("touch add");
			oCreateChattingRoom.visible(this.eLocationName.innerText, this.oClickPoint);
		}.bind(this));
		
		//mapClicker 메뉴중, star 버튼을 클릭했을때
		this.ePin.addEventListener('click', oBookmark.addBookmark);
	},	
};

var oKeyboardAction = {
	escPress: function() {
		//채팅방 생성페이지가 열려있을경우, 보이지 않게 처리
		if ( oUtil.getStyle(oCreateChattingRoom.oCreateChatRoom, "display") !== "none" )
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
 * Create Chat Room 채팅방 생성에 대한 Hidden Area에 대한 소스코드 시작
 **********************************************************************************************************/
//TODO oChat안으로 들어가야 한다.
var oCreateChattingRoom = {
		//채팅방 생성에 해당하는 중앙창에 대한 element
		oCreateChatRoom: document.getElementById('createChatRoom'),
		
		//채팅방명을 입력하는 input box element
		eRoomNameInput: document.querySelector('#createChatRoom .roomName'),
		
		//채팅방 참여인원 제한 수를 입력하는 input box element
		eLimitNumberInput: document.querySelector('#createChatRoom .limitNum'),
		
		//채팅방 생성취소 버튼
		eCancle: document.querySelector('#createChatRoom .cancle'),
		
		//채팅방을 생성하려고 하는 곳의 주소 
		//TODO 나중에는 좌표를받아서 서버단에서 해당하는 장소명을 가져오도록 변경해야 합니다.
		eRoomAddress: document.querySelector('#createChatRoom .createAddress'),
		
		//채팅방 생성 위치 좌표
		oLocationPoint: null,
		
		//채팅방 생성창을 열고, 다른메뉴와의 인터렉션을 막는 함수
		visible: function(locationName, oClickPoint) {
			this.oCreateChatRoom.style.display = "block";
			this.eRoomAddress.innerText = locationName;
			this.oLocationPoint = oClickPoint;
		},
		
		//채팅방 생성창을 닫고, 다른메뉴와의 인터렉션을 할 수 있도록 해주는 함수
		invisible: function() {
			this.oCreateChatRoom.style.display = "none";
			this.clearLimitNumValue();
			this.clearRoomNameValue();
		},
		
		init: function() {
			
			var eOuterBg = this.oCreateChatRoom.querySelector('.outer.bg'); 
			
			//중앙 입력영역을 제외한 곳을 클릭하면 focus off 하는 이벤트
			eOuterBg.addEventListener('touchend', function() {
				this.invisible();
			}.bind(this), false);
			
			//채팅방 생성요청에 대한 action 이벤트
			var eSubmit = this.oCreateChatRoom.querySelector('input[type=submit]');
			eSubmit.addEventListener('touchend', this.requestCreate.bind(this), false);
			
			//채팅방생성 취소에 대한 이벤트
			this.eCancle.addEventListener("click", this.invisible.bind(this));
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
			} else if ( roomNameValue.length <= 1 ) {
				alert('채팅방 제목은 2글자 이상 입력되어야 합니다.');
				return;
			} else if ( roomNameValue.length > 100 ) {
				alert("채팅방 제목은 100글자 이상을 넘을 수 없습니다.");
				return;
			};
			
			//참여인원 제한에 입력값이 숫자 형식이 아닐경우
			if ( isNaN( limitNumValue ) ) {
				alert("인원수 제한에는 숫자값을 입력해 주세요.");
				this.clearLimitNumValue();
				return;
			};
			
			//참여인원 제한숫자가 1일경우
			if ( limitNumValue <= 1 ) {
				alert("인원수는 1 이상으로 설정해야 합니다.");
				this.clearLimitNumValue();
				return;
			} else if (limitNumValue > 300 ){
				alert("채팅 인원은 300을 넘을 수 없습니다.");
				return;
			};
			
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
    			
    			if ( isSuccess === true 
    					&& markerNumber !== null 
    					&& markerNumber !== undefined 
    					&& isNaN(markerNumber) === false ) {
    				
    				oNaverMap.updateViewPointMarker(newMarker);
    				
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
 * mobileMain.js와 웹의 main.js의 호환을 위한 Object, 채팅서버에서 호출한다.
 **********************************************************************************************************/
var oAside = {
		deleteFromChattingList: function(chatRoomNumber) {
			oPanelContents.deleteFromChattingList(chatRoomNumber);
		},
		addChattingList: function(chatRoomNumber, oResult) {
			oPanelContents.addChattingList(chatRoomNumber, oResult);
		}
};
/*********************************************************************************************************
 * mobileMain.js와 웹의 main.js의 호환을 위한 Object
 **********************************************************************************************************/


/*********************************************************************************************************
 * 관심장소에 대한 소스코드 시작
 **********************************************************************************************************/
var oBookmark = {
		addBookmark: function() {
			var sInputFromUser = prompt("관심장소 이름");
			
			if ( sInputFromUser === null ) {
				return;
			}
			
			var oParameters = {
				"bookmarkName": sInputFromUser,
				"locationName": oMapClicker.sClickLocationName,
				"locationLatitude": oMapClicker.oClickPoint['y'],
				"locationLongitude": oMapClicker.oClickPoint['x'],
			};

			var callback = function(request) {
				var oResponse = JSON.parse(request.responseText);
				var isSuccess = oResponse['isSuccess'];

				if ( isSuccess ) {
					oPanelContents.addBookmarkToList(oResponse["bookmark"]);
	    		} else {
	    			alert("즐겨찾기 등록에 실패했습니다.\n다시 시도해주세요.");
	    		}
			}
			
			oAjax.getObjectFromJsonPostRequest("/bookmark/add", oParameters, callback.bind(this));
			//working
		},
		initializeBookmarkListInPanel: function() {
			var sBookmarkList = document.getElementById("bookmarkList").innerText;
			
			if ( sBookmarkList != null && sBookmarkList.length !=0 ) {
				var aBookmarkList = JSON.parse(sBookmarkList);
				
				var nBookmarkListLength = aBookmarkList.length;
				if ( nBookmarkListLength === 0 ) {
					oPanelContents.vacantBookmarkList();
				} else {
					for (var i = 0 ; i < nBookmarkListLength ; ++i ) {
						oPanelContents.addBookmarkToList(aBookmarkList[i]);
					}
				}
				
			}
		},
		initialize: function() {
			this.initializeBookmarkListInPanel();
		}
} 
/*********************************************************************************************************
 * 관심장소에 대한 소스코드 종료
 **********************************************************************************************************


/*********************************************************************************************************
 * 모두에게 공통되는 초기화 함수영역
 **********************************************************************************************************/
function initialize() {
	sBrowserPrefix = oUtil.getBrowserPrefix();
	boolIsMobile = oUtil.isMobile();

	oScroll.init();
	oHeader.init();
	oNav.init();
	oPanel.init();
	oSearching.initialize();
	oPanelContents.init();
	
	oNaverMap.init();
	oReverseGeoCode.init();
	oMarkerClicker.init();
	oMarkerInfo.init();
	oMapClicker.init();
	oCreateChattingRoom.init();
	oBookmark.initialize();
	oChat.init();
	
	/*
	 * TODO 초기 updateViewPointMarkers를 서버에서 전달해주는 식으로 변경되어야 한다.
	 */
	//------------------------------------------------------------------------------------//
	//Map 에 위치한 Marker 초기화
	oNaverMap.updateViewPointMarkers();
	//------------------------------------------------------------------------------------//
	
	/*
	 * 모든 초기화 작업이후, hidden element를 삭제한다.
	 */
	//------------------------------------------------------------------------------------//
	var aHiddenElement = document.querySelectorAll("script.hidden");
	var nElementLength = aHiddenElement.length;
  	for ( var index = 0 ; index < nElementLength ; ++ index ) {
  		aHiddenElement[index].remove();
  	}
	//------------------------------------------------------------------------------------//
  	
  	/*
	 * 윈도우창을 닫거나 강제종료하려고 할때 발생하는 이벤트
	 */
	//------------------------------------------------------------------------------------//
  	window.onbeforeunload = (function () {
		if ( oChat.isChatWindowVisible() ) {
			oChat.foldChattingRoom();
		}
		
        return "현재 창에서 유지하던 정보를 모두 잃어버립니다.\n정말로 실행하시겠습니까?";
    });
  	//------------------------------------------------------------------------------------//
}
