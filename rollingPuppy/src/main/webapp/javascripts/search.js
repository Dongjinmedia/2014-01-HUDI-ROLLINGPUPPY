var searchAPIkeyRealServer = "513cd098517cce82ec819f7862fb362f";
var dummyAPIkey = "c1b406b32dbbbbeee5f2a36ddc14067f";

var initialize = function() {
	var eSubmit = document.getElementById("submit");
	console.log(eSubmit);
	
	eSubmit.addEventListener('click', getResultXml, false);
}

function getResultXml(e){
	e.preventDefault();
	
	//var query = document.getElementById("search_box").value;
	//1. key부분에 key넣고,
	//2. 갈비집 부분에 query넣고, 
	var queryUrl = "http://openapi.naver.com/search?key=513cd098517cce82ec819f7862fb362f&query=갈비집&target=local&start=1&display=10"
	var request = new XMLHttpRequest();
	
	request.open("GET", queryUrl, false);
	request.onreadystatechange = function(){
		console.log("request.readyState : ", request.readyState);
		console.log("request.status : ", request.status);
		
		if ( request.readyState === 4 && request.status === 200 ) {
			var result = request.responseXML;
			console.log(result);
		}
	}
	request.setRequestHeader("Content-Type", "text/xml");
	console.log("test");
	request.setRequestHeader("Access-Control-Allow-Origin", "*");
	request.send(null);
	console.log(result);
	return result;

}

window.onload = initialize;