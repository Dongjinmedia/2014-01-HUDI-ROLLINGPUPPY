var oPanel ={
	ePanelButtons: document.querySelector("#panel_buttons"),
	ePanelWrapper: document.querySelector("#panel_wrapper"),
	
	addEvents: function() {
		console.log("addEvents");

		// panel_buttons 아래 있는 두 개의 button에 대한 클릭 이벤트를 받는다.
		// window에 orientation 속성이 있다면 모바일기기로 판단한다.
		// TODO window.orientation이 모바일 기기의 대표성을 띄는 지 확인해볼 것
		if (typeof window.orientation !== "undefined") {
			this.ePanelButtons.addEventListener(
					"touchend",
					this.panelButtonsHandler.bind(this)
			);
		} else {
			this.ePanelButtons.addEventListener(
					"click",
					this.panelButtonsHandler.bind(this)
			);
		}
		
		// mobile 페이지에서 animation을 정상적으로 종료시키지 않을 경우 성능저하가 발생했습니다.
		// 이에 각 브라우저 별 animationEnd 이벤트 리스너를 달았습니다.
		//    Chrome, Safari를 위한 webkitAnimationEnd
		//    IE, FireFox를 위한 animationend (** FireFox도 animationend를 사용한다 **)
		if (typeof document.body.style.webkitTransition !== "undefined") {
			this.ePanelWrapper.addEventListener(
					"webkitAnimationEnd",
					this.animationEndHandler.bind(this)
			);
		} else if (typeof document.body.style.msTransition !== "undefined"
				|| typeof document.body.style.MozTransition !== "undefined") {
			this.ePanelWrapper.addEventListener(
					"animationend",
					this.animationEndHandler.bind(this)
			);
		} else {
			console.log("도대체 어떤 브라우저를 쓰시길래....");
			return ;
		}
		
		// panel영역에 대한 flicking이벤트 연결
		this.ePanel.addEventListener(
			"touchstart",
			 this.panelTouchStart.bind(this)
		);
		
		this.ePanel.addEventListener(
			"touchmove",
			this.panelTouchMove.bind(this)
		);
		
		this.ePanel.addEventListener(
			"touchend",
			this.panelTouchEnd.bind(this)
		);
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
			this.removeClassName(this.ePanelWrapper, "unfoldedPanel");
			this.addClassName(this.ePanelWrapper, "foldPanel");
		} else {
			this.removeClassName(this.ePanelWrapper, "foldedPanel");
			this.addClassName(this.ePanelWrapper, "unfoldPanel");
		}
	},
	
	animationEndHandler: function(event) {
		if (this.ePanelWrapper.className === "unfoldPanel") {
			this.removeClassName(this.ePanelWrapper, "unfoldPanel");
			this.addClassName(this.ePanelWrapper, "unfoldedPanel");
		}
		else if (this.ePanelWrapper.className === "foldPanel") {
			this.removeClassName(this.ePanelWrapper, "foldPanel");
			this.addClassName(this.ePanelWrapper, "foldedPanel");
		}
		else {
			return ;
		}
	},
	
	ePanel: document.querySelector("#panel"),
	ePanelContents: document.querySelector("#panel_contents"),
	aSectionWrapper: document.querySelectorAll(".section_wrapper"),
	aMenu: document.querySelector("#nav_menu").children,
	
	//현재 화면에 보이는 패널의 인덱스번호
	nCurrentViewPanelIndex: 0,
	
	//setTimeout에 사용되는 시간값
	nAnimateTime: 0,
	
	//터치시작점 저장
	nTouchStartX: 0,
	nTouchStartY: 0,
	//터치 종료지점 저장
	nTouchEndX: 0,
	nTouchEndY: 0,
	// scroll or swipe를 판별하기 위한 값
	nTotalMoveX: 0,
	nTotalMoveY: 0,
	isScroll: null,
	
	//터치 이벤트 시작시 호출되는 함수
	panelTouchStart: function(event) {
		//IOS에서 링크영역을 잡고 플리킹할때, 플리킹종료 후 링크로 이동되는현상을 막아야 한다.

		// 일단 스크롤은 disable 시킵니다. 
		// 뒤에 panelTouchMove에서 스크롤 여부를 판별한 다음 enable 시킵니다.
		window.oScrolls["scroll" + mod(this.nCurrentViewPanelIndex, 4)].disable();
		console.log("panelTouchStart Event : ", event);

		var touch = event.touches[0];
		this.nTouchStartX = touch.pageX;
		this.nTouchStartY = touch.pageY;
	},
	
	//터치 이벤트 도중에 호출되는 함수
	panelTouchMove: function(event) {
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
				window.oScrolls["scroll" + mod(this.nCurrentViewPanelIndex, 4)].enable();
			}
		}
		
		// 스크롤을 해야 한다면 플리킹 로직을 실행하지 않고 종료합니다.
		if (this.isScroll) {
			return;
		}

		/* 플리킹 로직 */
		// nMoveLengthX 만큼 좌 우로 이동시킵니다.
		this.ePanelContents.style.webkitTransform = "translate(" + nMoveLengthX + "px)";
	},
	
	//터치가 종료될때 호출되는 함수
	panelTouchEnd: function(event) {
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
		window.oScrolls["scroll" + mod(this.nCurrentViewPanelIndex, 4)].enable();

		if (tempIsScroll) {
			return;
		}
		
		//TODO 변화값은 조절하도록
		var nMoveLengthX = this.nTouchStartX - this.nTouchEndX;
		if (nMoveLengthX > 70) {
			this.nCurrentViewPanelIndex++;
		} else if (nMoveLengthX < -70) {
			this.nCurrentViewPanelIndex--;
		} else {
			this.ePanelContents.style.webkitTransform = "translate(0)";
			return ;
		}
		
		this.ePanelContents.style.webkitTransform = "translate(0)";
		this.ePanelContents.style.webkitTransition = null;
		this._setPosition();
	},
	
	//인덱스 값을 확인해 패널의 left속성을 처리하는 함수
	_setPosition: function() {
		var nCenterIndex = mod(this.nCurrentViewPanelIndex, 4);
		var nLeftIndex = mod(this.nCurrentViewPanelIndex - 1, 4);
		var nRightIndex = mod(this.nCurrentViewPanelIndex + 1, 4);
		var nRightEndIndex = mod(this.nCurrentViewPanelIndex + 2, 4);
		
		this._changeCurrentMenuMarker(nCenterIndex);
		
		console.log("current: " + this.nCurrentViewPanelIndex);
		console.log(nLeftIndex + ", " + nCenterIndex + ", " + nRightIndex  + ", " + nRightEndIndex);
		this.aSectionWrapper[nLeftIndex].style.left = "-100%";
		this.aSectionWrapper[nCenterIndex].style.left = "0%";
		this.aSectionWrapper[nRightIndex].style.left = "100%";
		this.aSectionWrapper[nRightEndIndex].style.left = "200%";
	},
	
	_changeCurrentMenuMarker: function(nCenterIndex) {
		
		for ( var index = 0 ; index < this.aMenu.length ; ++index ) {
			this.removeClassName(this.aMenu[index], "on");
		};
		
		this.addClassName(this.aMenu[nCenterIndex], "on");
	},
	
	init : function(){
		this.addEvents();
		// 초기화 시점에 _setPosition을 한 번 실행하여 좌측 panel도 만들어 둡니다.
		this._setPosition();
		console.log("init");
	}
};

var oScrolls = {
	init: function() {
		for (var idx = 0; idx < 4; idx++) {
			oScrolls["scroll" + idx]
			= new IScroll("#scroll" + idx, { mouseWheel: true });
		}
	}
	
};

function mod(target, division) {
	return ( (target % division) + division ) % division;
}
