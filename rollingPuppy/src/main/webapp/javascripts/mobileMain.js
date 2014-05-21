var oPanel ={
	ePanelController: document.querySelector("panelController"),
	
	addEvents: function() {
		console.log("addEvents");
		// panel_buttons 아래 있는 두 개의 button에 대한 클릭 이벤트를 받는다.
		this.ePanelController.addEventListener(
			"click",
			this.panelButtonsHandler.bind(this)
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

	panelButtonsHandler : function(event) {
		event.preventDefault();
		var strButtonClassName = event.target.className;

		var boolFold = false;

		if(this.strButtonClassName === "panelButtonFold"){
			boolFold = true;
		}

		if (boolFold) {
			this.removeClassName(this.ePanelController, "unfold_panel");
			this.addClassName(this.ePanelController, "fold_panel");
		} else {
			this.removeClassName(this.ePanelController, "fold_panel");
			this.addClassName(this.ePanelController, "unfold_panel");
		}
	},

	init : function(){
		this.addEvents();
		console.log("init");
	}
}