var searchAPIkeyRealServer = "513cd098517cce82ec819f7862fb362f";


function getResultXml(){
	
	var query = document.getElementById("search_box").value;
	//1. key부분에 key넣고,
	//2. 갈비집 부분에 query넣고, 
	var queryUrl = "http://openapi.naver.com/search?key=c1b406b32dbbbbeee5f2a36ddc14067f&query=갈비집&target=local&start=1&display=10"
	var request = new XMLHttpRequest();
	
	request.open("GET", queryUrl, false);
	request.onreadystatechange = function(){
		if ( request.readyState === 4 && request.status === 200 ) {
			var result = request.responseXML;
		}
	}
	request.setRequestHeader("Content-Type", "text/xml");
	request.sent(null);
	
	

//	var customers = resultPage.childNodes[0];
//	
//	for (var i = 0; i < customers.children.length; i++ ) {
//		var customer = customers.children[i];
//		
//		var Name = Customer.getElementsByTagName("Name");
//		var Age = Customer.getElementsByTagName("Age");
//		var Color = Customer.getElementsByTagName("FavoriteColor");
//	  
//		// Write the data to the page.
//		document.write("<tr><td>");
//		document.write(Name[0].textContent.toString());
//		document.write("</td><td>");
//		document.write(Age[0].textContent.toString());
//		document.write("</td><td>");
//		document.write(Color[0].textContent.toString());
//		document.write("</td></tr>");
//	}
	
}