//특정 node의 style을 반환하는 함수
function getStyle(node, style) {
    return window.getComputedStyle(node, null).getPropertyValue(style);
}

//document의 특정 노드를 가져오는 함수
function getNode(node) {
    return document.getElementById(node);
}

var naverMap = getNode("naver_map");
var mapDivWidth = getStyle(naverMap, "width");
var mapDivHeight = getStyle(naverMap, "height");

var oCenterPoint = new nhn.api.map.LatLng(37.5010226, 127.0396037);
nhn.api.map.setDefaultPoint('LatLng'); //지도의 설정 값을 조회하는 메서드나 이벤트가 사용하는 좌표 객체의 디폴트 클래스를 설정
oMap = new nhn.api.map.Map(naverMap, {
    point: oCenterPoint, //지도 중심점의 좌표 설정
    zoom: 10, // - 초기 줌 레벨은 10으로 둔다.
    enableWheelZoom: true, //마우스 휠 동작으로 지도를 확대/축소할지 여부
    enableDragPan: true, //마우스로 끌어서 지도를 이동할지 여부
    enableDblClickZoom: false, //더블클릭으로 지도를 확대할지 여부
    mapMode: 0, //지도 모드(0 : 일반 지도, 1 : 겹침 지도, 2 : 위성 지도)
    activateTrafficMap: false, // 실시간 교통 활성화 여부
    activateBicycleMap: false, //자전거 지도 활성화 여부
    minMaxLevel: [1, 14], //지도의 최소/최대 축척 레벨
    size: new nhn.api.map.Size(mapDivWidth, mapDivHeight) //지도의 크기
});

var markerCount = 0;

var oSize = new nhn.api.map.Size(28, 37);
var oOffset = new nhn.api.map.Size(14, 37);
var oIcon = new nhn.api.map.Icon('http://www.apkdad.com/wp-content/uploads/2013/02/LINE-Card-Icon.png', oSize, oOffset); //마커 설정 정보
var oMapInfoTestWindow = new nhn.api.map.InfoWindow(); // - 마커를 클릭했을 때 뜨는 창. html코드만 삽입 가능

oMapInfoTestWindow.setVisible(false); // - infowindow 표시 여부 지정 
//여기서는 true로 바꿔도 아무 변화가 없음 
oMap.addOverlay(oMapInfoTestWindow); // - 지도에 추가

var oLabel = new nhn.api.map.MarkerLabel(); // 마커 위에 마우스 포인터를 올리면 나타나는 마커 라벨
oMap.addOverlay(oLabel); // - 마커 라벨 지도에 추가. 기본은 라벨이 보이지 않는 상태로 추가됨.

//changeVisible : event. 정보창의 표시여부 변경
//changeVisible {visible : Boolean} 요렇게 생김
//oMapInfoTestWindow에다가 changeVisible이라는 이벤트를 거는데, 이 이벤트가 걸리면 뭘 하냐면, 
oMapInfoTestWindow.attach('changeVisible', function(oCustomEvent) {
    if (oCustomEvent.visible) { //이벤트의 visible값이 true이면
        oLabel.setVisible(false); //라벨(마우스를 마커위에 클릭하지 않은채 올렸을때 나오는 창)은 가림
    }
});

// 원하는 동작을 구현한 이벤트 핸들러를 attach함수로 추가.
// void attach( String sEvent, Function eventHandler) 이벤트명,  이벤트 핸들러 함수
oMap.attach('mouseenter', function(oCustomEvent) { // mouseenter: 해당 객체 위에 마우스 포인터를 올림
    var oTarget = oCustomEvent.target; //target : 모든 이벤트에 존재하는 프로퍼티로, 해당 이벤트를 발생시킨 객체를 의미
    // 마커위에 마우스 올라간거면
    if (oTarget instanceof nhn.api.map.Marker) {
        var oMarker = oTarget;
        oLabel.setVisible(true, oMarker); // - 특정 마커를 지정하여 해당 마커의 title을 보여준다.
    }
});

oMap.attach('mouseleave', function(oCustomEvent) { //mouseleave : 마우스 포인터가 해당 객체 위를 벗어남
    var oTarget = oCustomEvent.target; //http://developer.naver.com/wiki/pages/JavaScript#section-JavaScript-Nhn.api.map.CustomControl의 public properties 부분 참조
    // 마커위에서 마우스 나간거면
    if (oTarget instanceof nhn.api.map.Marker) {
        oLabel.setVisible(false);
    }
});

oMap.attach('click', function(oCustomEvent) {
    var oPoint = oCustomEvent.point; //이벤트가 걸린곳의 좌표 
    var oTarget = oCustomEvent.target;
    oMapInfoTestWindow.setVisible(false);
    // 마커 클릭하면
    if (oTarget instanceof nhn.api.map.Marker) {
        // 겹침 마커 클릭한거면
        if (!oCustomEvent.clickCoveredMarker) {
            var menuTemplate =
                "<ul id='menu'>" +
                "<a class='menu-button navigation' href='#menu' ></a>" +
                "<a class='menu-button hide-navigation' href='#' ></a>" +
                "<li class='menu-item icon-picture'><a class='menu-item-back' href='#menu'></a></li>" +
                "<li class='menu-item icon-headphones'><a class='menu-item-back' href='#menu'></a></li>" +
                "<li class='menu-item icon-home'><a class='menu-item-back' href='#menu'></a></li>" +
                "<li class='menu-item icon-star'><a class='menu-item-back' href='#menu'></a></li>" +
                "<li class='menu-item icon-envelope-alt'><a class='menu-item-back' href='#menu'></a></li>" +
                "<li class='menu-item icon-cloud'><a class='menu-item-back' href='#menu'></a></li>" +
                "<li class='menu-item icon-heart'><a class='menu-item-back' href='#menu'></a></li>" +
                "<li class='menu-item icon-user'><a class='menu-item-back' href='#menu'></a></li>" +
                "<li class='menu-item icon-film'><a class='menu-item-back' href='#menu'></a></li>" +
                "<li class='menu-item icon-camera'><a class='menu-item-back' href='#menu'></a></li>" +
                "</ul>";

            // - InfoWindow 에 들어갈 내용은 setContent 로 자유롭게 넣을 수 있습니다. 외부 css를 이용할 수 있으며, 
            // - 외부 css에 선언된 class를 이용하면 해당 class의 스타일을 바로 적용할 수 있습니다.
            // - 단, DIV 의 position style 은 absolute 가 되면 안되며, 
            // - absolute 의 경우 autoPosition 이 동작하지 않습니다. 
            oMapInfoTestWindow.setContent(menuTemplate); //여기가 info window의 html코드를 넣는 부분
            oMapInfoTestWindow.setPoint(oTarget.getPoint());
            oMapInfoTestWindow.setVisible(true);
            oMapInfoTestWindow.setPosition({ //지도 상에서 정보창을 표시할 위치를 설정 
                right: 0,
                top: -19
            });
            oMapInfoTestWindow.autoPosition(); //정보 창의 일부 또는 전체가 지도 밖에 있으면, 정보 창 전체가 보이도록 자동으로 지도를 이동 
        }
    } else {
        var oMarker = new nhn.api.map.Marker(oIcon, {
            title: '마커 : ' + oPoint.toString()
        });
        oMarker.setPoint(oPoint);
        oMap.addOverlay(oMarker);
    }
});