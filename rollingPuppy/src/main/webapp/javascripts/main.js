/*
 * Main.jsp에 대한 자바스크립트 소스코드. 초기화 함수는 최하단에 있습니다.
 */

/*********************************************************************************************************
 * 모두에게 공통되는 유틸함수 영역
*********************************************************************************************************/
//temp key variable.
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
				
				for (var key in oParameters){
					//hasOwnProperty is used to check if your target really have that property, 
					//rather than have it inherited from its prototype. A bit simplier would be
				    if (oParameters.hasOwnProperty(key)) {
				    	formData.append(key, oParameters[key]);
				    }
				}
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
		
		// panel 아래 folding button 중 클릭 이벤트를 받는다.
		// 향후 event delegation 방식으로 변경할 것.
		for (var idx = 0; idx < elButtons.length; idx++) {
			elButtons[idx].addEventListener(
					'click',
					this.fnPanelButtonHandler.bind(this)
			);
		}
		
		// elPanel에서 animationEnd 이벤트를 받는다.
		this.elPanel.addEventListener(
				'animationEnd',
				this.fnAnimationEndHandler.bind(this)
		);
		this.elPanel.addEventListener(
				'webkitAnimationEnd',
				this.fnAnimationEndHandler.bind(this)
		);
	},
	
	// panel 접기 버튼에 발생하는 click이벤트 콜백함수  
	fnPanelButtonHandler: function(event) {
		if (!event || !event.target) {
			return ;
		}
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
	},
	
	fnAnimationEndHandler: function(event) {
		if (!event || !event.target) {
			return ;
		}
		event.preventDefault();
		
		var strContainerClassName = this.elContainer.className;
		
		if (strContainerClassName == 'fold_panel') {
			this.elContainer.className = '';
		} else if(strContainerClassName == 'unfold_panel') {
			this.elContainer.className = 'unfolded_panel';
		} else {
			return ;
		}
	}
}

var NavList = {
	elNavList: document.getElementById('nav_list'),
	elLatestClickedMenu: null,
	elLatestPanelContents: null,
	
	addEvents: function() {
		this.elNavList.addEventListener(
				'click',
				this.fnNavButtonHandler.bind(this)
		);
	},
	
	fnNavButtonHandler: function(event) {
		if (!event || !event.target) {
			return ;
		}
		if (event.target.tagName.toLowerCase() != 'a') {
			return ;
		}
		event.preventDefault();
		
		if (this.elLatestClickedMenu) {
			this.elLatestClickedMenu.className = '';
			this.elLatestPanelContents.className = '';
		}
		this.elLatestClickedMenu = event.target.parentNode;
		this.elLatestPanelContents = document.getElementById(event.target.className);
		
		this.elLatestClickedMenu.className = 'on';
		this.elLatestPanelContents.className = 'on';
	}
}

/*********************************************************************************************************
 * 네비게이션관련 소스코드 끝
 **********************************************************************************************************/

/*********************************************************************************************************
 * 소은, 세훈이가 작성한 네이버맵 API관련 소스코드 시작
 **********************************************************************************************************/
var naverMapSettings = {
		naverMap: null, //Main Page에서 Map영역에 해당하는  div객체
	    oCenterPoint: null, //지도 중심으로 포커싱할 위치를 저장하는 객체 (LatLng 좌표사용)
	    oMap: null, //맵옵션을 모두 저장하고 있는 지도의 기본이 되는 객체
	    oIcon: null,
	    oMarkerInfoWindow: null,
	    oLabel: null,
	    aMarkerList: null,
	    oZoomController: null, // 줌인, 줌아웃 동작을 위한 버튼 객체
	    
	    //지도위에 마커를 더하는 소스코드. 인자로 위도, 경도, 채팅방의 고유번호, 채팅방제목을 가져온다.
	    addMarker: function(latitude, longitude, chatRoomNumber, title) {
	    	//Point 객체를 생성한다.
	    	 var oPoint = new nhn.api.map.LatLng(latitude, longitude);
	    	
	    	 //마커객체를 생성한다.
	    	var oMarker = new nhn.api.map.Marker(naverMapSettings.oIcon, {
	    	    title: '제목 : '+title
	    	});
	    	//마커객체에 Point를 설정한다.
	    	oMarker.setPoint(oPoint);
	    	//마커객체에 Attirubte를 추가한다. (chatRoomNumber)
	    	oMarker.chatRoomNumber = chatRoomNumber;
	    	
	    	//맵에 마커를 더한다.
	    	this.oMap.addOverlay(oMarker);
	    },
	    
	    //지도위의 Map 마커상태값을 업데이트하는 메서드.
	    //TODO 현재 네트워크 부하를 줄일 수 있는 알고리즘이나 방법을 생각한다.
	    updateMapStatus: function() {
	    	
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
	    		//var oResponse = oAjax.getObjectFromJsonGetRequest("/chat/getList", oParameters);
	    		var oResponse = oAjax.getObjectFromJsonPostRequest("/chat/getList", oParameters);
	    		
	    		//response데이터에서 현재 화면에 해당하는 마커정보를 담은 Object Array를 변수에 초기화한다.
	    		var aDatas = oResponse['chatRoomList'];

	    		//Object Array를 돌면서
	    		for (var index in aDatas) {
	    			
	    			//TODO  계속 더하기만 되다보니, 성능상의 이슈가 발생한다. 위치이동별 버퍼비우기 등을 강구해보자.
	    			//naverMapSettings에 저장된 현재까지 Load한 Marker가 
	    			//저장된 Array에 새로 저장하고자 하는 마커가 존재하는지 체크,
	    			if ( this.aMarkerList.indexOf(aDatas[index]['id']) > -1 ) {
	    				continue;
	    			//존재하지 않을경우, Load Marker Array에 추가하고, 맵에 마커를 더한다.
	    			} else {
	    				this.aMarkerList.push(aDatas[index]['id']);
	    				this.addMarker(aDatas[index]['location_latitude'], aDatas[index]['location_longitude'], aDatas[index]['id'], aDatas[index]['title']);
	    			}
	    		}
	    	}
	    },
	    
	    //Zoom 조절을 위한 함수
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
	        this.oMarkerInfoWindow.attach("changeVisible", this.changeVisibleEvent.bind(this)); 
	        this.oMap.attach("mouseenter", this.mouseEnterEvent.bind(this)); // mouseenter: 해당 객체 위에 마우스 포인터를 올림
	        this.oMap.attach("mouseleave", this.mouseLeaveEvent.bind(this)); //mouseleave : 마우스 포인터가 해당 객체 위를 벗어남
	        this.oMap.attach("dragstart",this.dragStartEvent.bind(this));
	        this.oMap.attach("dragend",this.dragEndEvent.bind(this));
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

	    //TODO 네트워크 비용을 낮추기위해 내부적으로 현재 좌표이동을 체크하는 로직이 필요하다. (현재는 클릭만해도 동작)
	    //TODO Drag를 위한 최소단위 설정을 고려해보자.
	    dragEndEvent: function(oCustomEvent) {
	    	this.updateMapStatus();
	    },

	    clickEvent : function(oCustomEvent) {
	        var oTarget = oCustomEvent.target;
	        this.oMarkerInfoWindow.setVisible(false);
	        // 마커 클릭하면
	        if (oTarget instanceof nhn.api.map.Marker) {
	            // 겹침 마커 클릭한거면
	            if (!oCustomEvent.clickCoveredMarker) {
	            	//TODO 채팅방번호
	            	//alert(oTarget.chatRoomNumber);
	            	
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
	        
	        
	        this.aMarkerList = new Array();
	        
	        // 줌인, 줌아웃 동작을 위해 줌인 버튼과 줌아웃 버튼을 생성하고
	        // 각 버튼의 클릭 이벤트를 통해 줌 레벨 변경할 수 있게 만든다.
	        this.oZoomController = {
	        		zoomInButton: document.getElementById("zoomInButton"),
	        		zoomOutButton: document.getElementById("zoomOutButton"),
	        		
	        		addEventForZoom: function() {
	        			this.zoomInButton.addEventListener('click', this.changeZoomLevel.bind(this));
	        			this.zoomOutButton.addEventListener('click', this.changeZoomLevel.bind(this));
	        		},
	        		
	        		changeZoomLevel: function(e){
	        			var currentZoomLevel = naverMapSettings.getZoom();
	        			
	        			if(e.target.id === "zoomInButton") {
	        				naverMapSettings.changeZoom(++currentZoomLevel);
	        			}
	        			else if(e.target.id === "zoomOutButton") {
	        				naverMapSettings.changeZoom(--currentZoomLevel);
	        			}
	        		}
	        }
	        this.oZoomController.addEventForZoom();
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
		//아이콘정보를 Array에 담는다. 현재는 채팅방, 안내에 대한 icon Object를 담는다.
  		//클린된 메뉴가 있는지 없는지를 체크하고, 초기화하는 등의 액션을 위해 필요하다.
		aIcons.push(oIcon);
		
		//마우스가 메뉴아이콘 위에 위치할경우, Content영역이 보여지도록 한다.
		oIcon.addEventListener('mouseover', function() {
			oMenu.style.display = 'block';
		},false);
  
		oIcon.addEventListener('mouseout', function() {
			var status = oIcon.getAttribute('status');
		
			if ( status != 'clicked')
				oMenu.style.display = 'none';
		},false);
	
		//클릭을 통해 Content영역을 고정할 수 있도록 하기 위한 이벤트
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
//working
var oChat = {
		messageBox: null,
		inputBox: null,
		nickname: null,
		enterChatRoom: function() {
			alert("채팅방으로 이동합니다.");
			var content = document.getElementById("content");
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
			
			//입장을 서버에 알린다
			//TODO roomname 변경
			socket.emit('join', {'userid': nickname, 'roomNumber': 1});
		},
		enterChatRoomOthers: function(user) {
			this.messageBox.insertAdjacentHTML( 'beforeend', "<dd style='margin:0px;'>"+user+"님이 접속 하셨습니다.</dd>");
		},
		sendMessage: function(message) {
			socket.emit('message', this.nickname+ " : " + message);
		},
		getMessage: function(message) {
			this.messageBox.insertAdjacentHTML( 'beforeend',"<dd style='margin:0px;'>"+message+"</dd");
			this.inputBox.value="";
		},
		initialize: function() {
			var socket = io.connect('http://127.0.0.1:3080');
			//TODO 채팅전체 DIV를 가져오기. 하위 엘리먼트들은 그 ele을 중심으로 찾기
			this.messageBox = document.getElementById("txtappend"); 
			this.inputBox = document.getElementById("txt");
			
			//TODO NICK NAME 정보를 클라이언트에서 제공하고 있으며, 그 정보는 변조될 수 있다.
			//Nodejs에서 웹서버에 요청하는 형태, 혹은 그 반대가 되어야 한다.
			this.nickname = document.getElementById("nickname").value;

			
			//메세지 전송버튼을 클릭할 시	
			document.getElementById("btn").addEventListener('click', function(e) {
				this.sendMessage( this.inputBox.value );
			}, false);
			
			//새로 접속 한 사용자가 있을 경우 알림을 받는다.
			socket.on('join', function(user) {
				this.enterChatRoomOthers(user);
			});
			
			socket.on('message', function (message) {
				this.getMessage(message);
			});
		}
};
/*********************************************************************************************************
 * Chatting에 대한 소스코드 종료
 **********************************************************************************************************/

/*********************************************************************************************************
 * Create Chat Room 채팅방 생성에 대한 Hidden Area에 대한 소스코드 시작
 **********************************************************************************************************/
var oCreateChattingRoom = {
		//채팅방 생성에 해당하는 중앙창에 대한 element
		oCreateChatRoom: null,
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
			
			var isSuccess = oResponseData['isSuccess'];
			var chatRoomNumber = oResponseData['chatRoomNumber'];
			
			//TODO 마커에 고유 아이디값을 부여
			if ( isSuccess === true 
					&& chatRoomNumber !== null 
					&& chatRoomNumber !== undefined 
					&& isNaN(chatRoomNumber) === false ) {
				
				//마커를 생성
				naverMapSettings.aMarkerList.push(chatRoomNumber);
				naverMapSettings.addMarker(oMapClicker.oClickPoint['y'], oMapClicker.oClickPoint['x'], chatRoomNumber, roomNameValue);
				
				//TODO oMarker의 타이틀을 지역이름으로 저장한다.
				
		    	
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

		//초기상태에서는 마커를 노출하지 않기 위해 invisible호출
		this.invisible();

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
	//Map 에 위치한 Marker 초기화
	naverMapSettings.updateMapStatus();
	//------------------------------------------------------------------------------------//
	
	/*
	 * 현재 윤성이 작업중
	 */
	//------------------------------------------------------------------------------------//
	//키보드 입력에 대한 Object
	oKeyboardAction.initialize();
	//------------------------------------------------------------------------------------//
	
	/*
	 * 현재 윤성이 작업중
	 */
	//------------------------------------------------------------------------------------//
	//Chatting을 위한  socket.io 초기화 영역
	oChat.initialize();
	//------------------------------------------------------------------------------------//
}

window.onload = initialize();
