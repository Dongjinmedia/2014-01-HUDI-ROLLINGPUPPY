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


var oMemberPanel = {
		eMemberIcon : null,
		eRightArea: null,
		addEvents: function(){
			console.log("addEvents");
			console.log("eMemberIcon", eMemberIcon);
			this.eMemberIcon.addEventListener("touchend",this.memberPanelHandler.bind(this));
			this.eMemberIcon.addEventListener("click",this.memberPanelHandler.bind(this));
		},
				
		//member icon을 click하거나 touch 이벤트가 발생하면 실행되는 콜백함수 
		memberPanelHandler: function(e){
			event.preventDefault();
			console.log(eRightArea.className);
			if ( eRightArea.className.indexOf("unfold") !== -1 ) {
				removeClassName(eRightArea, "unfold");
				addClassName(eRightArea, "fold");
			} else {
				removeClassName(eRightArea, "fold");						
				addClassName(eRightArea, "unfold");
			}					
		},
		
		init: function(){
			eMemberIcon = document.querySelector(".top .menu .icon-member");
			eRightArea = document.querySelector(".rightArea");
			console.log("init");
			this.addEvents();
		}
}