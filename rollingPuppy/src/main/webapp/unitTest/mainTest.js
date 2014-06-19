//Test Case Principle
//1. Given
//2. When
//3. Then

asyncTest("리버스 지오코드 Object의 getAddress 메소드 테스트", function() {
	
//==========Initialize==========	
	oReverseGeoCode.initialize();
	
//==========Given==========
	//대한민국 경기도 성남시 분당구 삼평동 680
	//37.401224,127.108628,17
	var latitude = 37.401224;
	var longitude = 127.108628;
	var address = "대한민국 경기도 성남시 분당구 삼평동 680"; 
	//var clickedLatlng = new google.maps.LatLng(latitude, longitude);
	
//==========When==========
	
	var returnAddress = null;
	
	oReverseGeoCode.getAddress(latitude, longitude, function(results, status){
    	if(status == google.maps.GeocoderStatus.OK) {
    		if (results[0]) {
    			returnAddress = results[0].formatted_address;
    		}
    	} else {
    		console.log("reverseGeoCode status not fine ");
    	}
    }.bind(this));	

    
//==========Then==========
	setTimeout (function() {
		start();
		//equal(returnAddress, address);
		equal(returnAddress, address);	
	}.bind(this), 1000);
});



test("로그인 클릭 테스트", function(){
	
	//==========Given==========
	var eLoginEntireArea = document.querySelector(".loginArea");
	var eJoinEntireArea = document.querySelector(".joinArea");
	var eLoginSelector = document.querySelector(".c_login");
	
	var eTitle = document.querySelector(".title");
	
	oSelectBox.eTitle = eTitle; 
	oSelectBox.eComment = eTitle.nextElementSibling;
	
	eLoginSelector.addEventListener(
			"click",
			function() {
				oSelectBox.changeView(
						eLoginEntireArea,
						eJoinEntireArea,
						"Welcome!",
						"Welcome My Neighbor"
				);
				oUtil.addClassName(eLoginSelector, "clicked");
				//oUtil.removeClassName(eJoinSelector, "clicked");
			}.bind(this), false);
	
	
	//==========When==========
	eLoginEntireArea.style.display = "none";
	fireEvent(eLoginSelector,"click");

	//==========Then==========
	equal(eLoginEntireArea.style.display, "block");
	
});


//==========Variable For Component Test START========== 
var oChat = {
		oInfo: {
			"1": {
				"title": "내가 조선의 국모이다.",
				"oParticipant": {
					"1": {
						"backgroundColor": "#f57c0e",
						"backgroundImage": "/images/userIcons/6.png",
						"nicknameAdjective": "늙은",
						"nicknameNoun": "옥수수수염"
					}
				}
			},

			"2": {
				"title": "안녕하세요",
				"oParticipant": {
					"1": {
						"backgroundColor": "#f57c0e",
						"backgroundImage": "/images/userIcons/6.png",
						"nicknameAdjective": "늙은",
						"nicknameNoun": "옥수수수염"
					}
				}
			}
		} 
};

//==========Variable For Component Test END==========


test("팝업창 Message 갯수 테스트", function() {
	//Given
	var oMessageInfo = {
		"day": 19,
		"isMyMessage": 0,
		"message": "안녕",
		"month": 6,
		"tblChatRoomId": 1,
		"tblMemberId": "1",
		"time": "22:30",
		"week": "Fri"	
	};
	
	//==========Given==========
	var eNoticeBox = document.getElementById("noticeBox");
	
	//==========When==========
	new Message(oMessageInfo);
	//Then
	equal(eNoticeBox.children.length, 1);
	
	//==========When==========
	oMessageInfo["tblChatRoomId"] = 2;
	new Message(oMessageInfo);
	//Then
	equal(eNoticeBox.children.length, 2);
	
	//==========When==========
	oMessageInfo["tblChatRoomId"] = 1;
	new Message(oMessageInfo);
	//Then
	equal(eNoticeBox.children.length, 2);
});


test("팝업창 Element Data 테스트", function() {
	//==========Given==========
	
	//Given
	var oMessageInfo = {
		"day": 19,
		"isMyMessage": 0,
		"message": "안녕",
		"month": 6,
		"tblChatRoomId": 1,
		"tblMemberId": "1",
		"time": "22:30",
		"week": "Fri"	
	};
	
	var fakeMessageBox = document.getElementById("fakeNoticeBox");
	var messageBox = document.getElementById("noticeBox");
	
	var expectedLiString = 
		"<li class=\"notice\" style=\"bottom: 0px; display: inline-block; opacity: 1;\">"
		+ "<span class=\"title\">내가 조선의 국모이다.</span>"
		+ "<span class=\"profile\""
			+ "style=\"background-image: url('test.png');"
			+ "background-color: #f57c0e;\">"
		+ "</span>" 
		+ "<span class=\"nickname\">늙은옥수수수염</span>"
		+ "<span class=\"message\">안녕</span></li>";
		
	fakeMessageBox.innerHTML = expectedLiString;
	fakeMessageBox.querySelector(".profile").style.backgroundImage = "url(/images/userIcons/6.png)";
	//==========When==========
	new Message(oMessageInfo);
	
	console.log("fakeMessageBox : ", fakeMessageBox);
	console.log("messageBox : ", messageBox);
	//==========Then==========
	var resultLi = messageBox.querySelector("li");
	var fakeResultLi = fakeMessageBox.querySelector("li");
	
	equal(resultLi.outerHTML, fakeResultLi.outerHTML);
	
});