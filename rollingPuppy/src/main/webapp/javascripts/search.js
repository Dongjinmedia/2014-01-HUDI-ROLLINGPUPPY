var searchAPIkeyRealServer = "513cd098517cce82ec819f7862fb362f";


var initialize = function() {
	var eSubmit = document.getElementById("submit");
	//child로 해서 submit button 찾을것 
	console.log(eSubmit);
	eSubmit.addEventListener('click', getResultXml, false);
}

function getResultXml(event){
	event.preventDefault();
	
	var queryKeyword = document.getElementById("search_box").value; 
	//child로 해서 search_word찾아라 
	console.log(queryKeyword);
	var url = "/search?searchKeyword="+queryKeyword;
	
	var request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.onreadystatechange = function(){
		if ( request.readyState === 4 && request.status === 200 ) {
			var oResult = JSON.parse(request.responseText);
			console.log(oResult);

			var storeName = oResult["storeName"];
			var category = oResult["category"];
			var address = oResult["address"];
			var cartesianX = oResult["cartesianX"];
			var cartesianY = oResult["cartesianY"];
		
		}
	}
	request.send();
}

window.onload = initialize;