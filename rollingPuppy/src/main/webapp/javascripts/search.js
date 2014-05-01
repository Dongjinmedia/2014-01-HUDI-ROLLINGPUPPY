var searchAPIkeyRealServer = "513cd098517cce82ec819f7862fb362f";


function getResultXml(){
	
	//var query = document.getElementById("search_box").value;
	//1. key부분에 key넣고,
	//2. 갈비집 부분에 query넣고, 
	var queryUrl = "http://openapi.naver.com/search?key=c1b406b32dbbbbeee5f2a36ddc14067f&query=갈비집&target=local&start=1&display=10"
	var request = new XMLHttpRequest();
	
//	request.open("GET", queryUrl, false);
//	request.onreadystatechange = function(){
//		if ( request.readyState === 4 && request.status === 200 ) {
//			var result = request.responseXML;
//		}
//	}
//	request.setRequestHeader("Content-Type", "text/xml");
//	request.sent(null);
//	console.log(result);
//	return result;
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", queryUrl, false);
	xmlhttp.setRequestHeader('Content-Type', 'text/xml');
	xmlhttp.send("");
	xmlDoc = xmlhttp.responseXML;
	readXML();
	
}

window.onload = getResultXml;