var searchAPIkeyRealServer = "513cd098517cce82ec819f7862fb362f";


var initialize = function() {
	var eSubmit = document.getElementById("search_box").children[1]; 
	console.log(eSubmit);
	eSubmit.addEventListener('click', getResultXml, false);
}

function getResultXml(event){
	
	
	var queryKeyword = document.getElementById("search_box").children[0].value; 
	var url = "/search?searchKeyword="+queryKeyword;
	
	var request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.onreadystatechange = function(){
		if ( request.readyState === 4 && request.status === 200 ) {
			var aResult = JSON.parse(request.responseText); //json을 파싱해서 object로 넣는
			console.log(aResult);
			if(aResult.length == 0){
				//template element가져오기
				var eDefaultTemplate = document.getElementById("template").querySelector(".default");			
				//aResult를 for문을 돌며 template element를 복사한 변수를 가져와서 데이터 삽입 
				var eTarget = document.getElementById("pc_search").querySelector("ul");
				//이미 존재하는 검색 결과가 있다면 지운다.
				while (eTarget.firstChild) {
					eTarget.removeChild(eTarget.firstChild);
				}
				var eCopiedDefaultTemplate = eDefaultTemplate.cloneNode(true);
				eCopiedDefaultTemplate.querySelector(".comment").innerText = "검색 결과가 존재하지 않습니다.";
				//template을 원하는 위치에 삽입
				eTarget.appendChild(eCopiedDefaultTemplate);
				
			} else {
			
				//template element가져오기
				var eTemplate = document.getElementById("template").querySelector(".search");			
				//aResult를 for문을 돌며 template element를 복사한 변수를 가져와서 데이터 삽입 
				var eTarget = document.getElementById("pc_search").querySelector("ul");
				//이미 존재하는 검색 결과가 있다면 지운다.
				while (eTarget.firstChild) {
					eTarget.removeChild(eTarget.firstChild);
				}
				
				for( var i = 0 ; i < aResult.length ; ++i){
					var eCopiedTemplate = eTemplate.cloneNode(true);
					var eSearchedTitle = eCopiedTemplate.querySelector(".title");
					var eSearchedCategory = eCopiedTemplate.querySelector(".category");
					var eSearchedAddress = eCopiedTemplate.querySelector(".address");
								
					eSearchedTitle.innerHTML = aResult[i]["storeName"]; 
					eSearchedCategory.innerText = aResult[i]["category"]; 
					eSearchedAddress.innerText = aResult[i]["address"];
					eCopiedTemplate["cartesianX"] = aResult[i]["cartesianX"];
					eCopiedTemplate["cartesianY"] = aResult[i]["cartesianY"];
					
					//template을 원하는 위치에 삽입
					eTarget.appendChild(eCopiedTemplate);
				}
			}
		}
	}
	request.send();
}

window.onload = initialize;