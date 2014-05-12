//Test Case Principle
//1. Given
//2. When
//3. Then




//callback
asyncTest("리버스 지오코드 Object", function() {
	//oReverseGeoCode.initialize();
//==========Given==========
	//대한민국 경기도 성남시 분당구 삼평동 680
	//37.401224,127.108628,17
	var latitude = 37.401224;
	var longitude = 127.108628;
	var address = "대한민국 경기도 성남시 분당구 삼평동 680"; 
	//var clickedLatlng = new google.maps.LatLng(latitude, longitude);
	
//==========When==========
    //var returnAddress = window.reverseGeo(clickedLatlng); 
	var returnAddress = oReverseGeoCode.getAddress(latitude, longitude);
//==========Then==========
	
	setTimeout (function() {
		start();
		//equal(returnAddress, address);
		equal(oReverseGeoCode.address, address);
	}.bind(this), 1000);
	//deepEqual()
});