var initialize = function() {
	var eChattingRoomListButtonInNavigationBar = document.querySelector("#nav_list .chatting"); 
	eChattingRoomListButtonInNavigationBar.addEventListener('click', getResultXml, false);
}

function getResultXml(event){
	
	var queryKeyword = "selectChattingRoomListPanel"; 
	var incompleteUrl = "/panel/enteredChattingRoomList?userAction=";
	
	var callback = function(request){
		
		console.log(request.responseText);
		var aResult = JSON.parse(request.responseText);

		console.log(aResult);

		if(aResult.length === 0){
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
			
		} else {
			
			//template element가져오기
			var eTemplate = document.getElementById("template").querySelector(".chatRoom");			
			//aResult를 for문을 돌며 template element를 복사한 변수를 가져와서 데이터 삽입 
			var eTarget = document.getElementById("pc_chatting").querySelector("ul");
			
			//이미 존재하는 채팅방 목록이 있면 지운다.
			while (eTarget.firstChild) {
				eTarget.removeChild(eTarget.firstChild);
			}
			
			for( var i = 0 ; i < aResult.length ; ++i){
				var eCopiedTemplate = eTemplate.cloneNode(true);
				var eChattingRoomTitle = eCopiedTemplate.querySelector(".title");
				var eChattingRoomMax = eCopiedTemplate.querySelector(".limit");
				var eChattingRoomAddress = eCopiedTemplate.querySelector(".address");
				
				eChattingRoomTitle.innerHTML = aResult[i]["chatRoomTitle"]; 
				eChattingRoomMax.innerText = aResult[i]["max"]; 
				eChattingRoomAddress.innerText = aResult[i]["locationName"];

				//template을 원하는 위치에 삽입
				eTarget.appendChild(eCopiedTemplate);
			}
		}
	};
	
	oAjax.getObjectFromJsonGetRequest(incompleteUrl, queryKeyword, callback);
}

window.onload = initialize;