var oPanel ={
	ePanelController: document.querySelector("panelController"),
	ePanelWrapper: document.querySelector("panelWrapper"),
	
	addEvents: function() {
		console.log("addEvents");
		// panel_buttons 아래 있는 두 개의 button에 대한 클릭 이벤트를 받는다.
		this.ePanelController.addEventListener(
			"click",
			this.panelButtonsHandler.bind(this)
		);
		
		/* 윤성작업중 시작 */
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
		/* 윤성작업중 종료 */
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

	panelButtonsHandler : function(event) {
		console.log(event.target);
		event.preventDefault();
		var strButtonClassName = event.target.className;

		var boolFold = false;
		if(strButtonClassName === "panelFold"){
			boolFold = true;
		}

		if (boolFold) {
			this.removeClassName(this.ePanelWrapper, "unfold_panel");
			this.addClassName(this.ePanelWrapper, "fold_panel");
		} else {
			this.removeClassName(this.ePanelWrapper, "fold_panel");
			this.addClassName(this.ePanelWrapper, "unfold_panel");
		}
	},
	
	/* 윤성작업중 시작 */
	ePanel: document.querySelector("panel"),
	eContents: document.querySelector("contents"),
	aSection: document.querySelectorAll("contents section"),
	aMenu: document.querySelector("navigation menu").children,
	
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
	
	
	//터치 이벤트 시작시 호출되는 함수
	panelTouchStart: function(event) {
		//IOS에서 링크영역을 잡고 플리킹할때, 플리킹종료 후 링크로 이동되는현상을 막아야 한다.	
		console.log("panelTouchStart Event : ", event);
		//
		var touch = event.touches[0];
		this.nTouchStartX = touch.pageX;
		this.nTouchStartY = touch.pageY;
	},
	
	//터치 이벤트 도중에 호출되는 함수
	panelTouchMove: function(event) {
		var touch = event.touches[0];
		this.nTouchEndX = touch.pageX;
		this.nTouchEndY = touch.pageY;
		
		var nMoveLength = this.nTouchEndX - this.nTouchStartX;
		
		if (this.nCurrentViewPanelIndex <= 0 && nMoveLength > 0
		  ||this.nCurrentViewPanelIndex >= 3 && nMoveLength < 0) {
			 return false;
		} else {
			console.log(nMoveLength);
			this.eContents.style.webkitTransform = "translate("+nMoveLength+"px)";
		}
	},
	
	//터치가 종료될때 호출되는 함수
	panelTouchEnd: function(event) {
		console.log("panelTouchEnd Event : ", event);
		
		var touch = event.changedTouches[0];
		var nTempIndex = this.nCurrentViewPanelIndex;

		this.nTouchEndX = touch.pageX;
		this.nTouchEndY = touch.pageY;
		
		//TODO 변화값은 조절하도록
		if ( this.nTouchStartX - this.nTouchEndX > 10 ) {
			this.nCurrentViewPanelIndex++;
		} else {
			this.nCurrentViewPanelIndex--;
		}
		
		
		if (this.nCurrentViewPanelIndex >=0 && this.nCurrentViewPanelIndex <=3 ) {
			this._setPosition();
			
			this.eContents.style.webkitTransform = "translate(0)";
			this.eContents.style.webkitTransition = null;
		} else {
			this.nCurrentViewPanelIndex = nTempIndex;
		}
	},
	
	//인덱스 값을 확인해 패널의 left속성을 처리하는 함수
	_setPosition: function() {
		var nCenterIndex = this.nCurrentViewPanelIndex % 4;
		var nLeftIndex = this.nCurrentViewPanelIndex -1;
		var nRightIndex = this.nCurrentViewPanelIndex +1;
		var nRightEndIndex = this.nCurrentViewPanelIndex +2;
		
		this._changeCurrentMenuMarker(nCenterIndex);
		
		if ( nCenterIndex - 1 < 0 ) {
			nLeftIndex = 3;
		}
		
		if ( nCenterIndex + 1 > 3 ) {
			nRightIndex = 0;
			nRightEndIndex = 1;
		}
			
		this.aSection[nLeftIndex].style.left = "-100%";
		this.aSection[nCenterIndex].style.left = "0%";
		this.aSection[nRightIndex].style.left = "100%";
		this.aSection[nRightEndIndex].style.left = "200%";
	},
	
	_changeCurrentMenuMarker: function(nCenterIndex) {
		
		for ( var index = 0 ; index < this.aMenu.length ; ++index ) {
			this.removeClassName(this.aMenu[index], "on");
		};
		
		this.addClassName(this.aMenu[nCenterIndex], "on");
	},
	
	/* 윤성작업중 종료 */	

	init : function(){
		this.addEvents();
		console.log("init");
		
	/* 윤성작업중 시작 */
			
	/* 윤성작업중 종료 */
	}
}