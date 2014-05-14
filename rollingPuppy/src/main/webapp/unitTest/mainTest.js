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