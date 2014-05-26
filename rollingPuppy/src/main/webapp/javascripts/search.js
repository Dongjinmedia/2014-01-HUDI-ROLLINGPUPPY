//var initialize = function() {
//	var eSubmit = document.getElementById("search_box").children[1]; 
//	eSubmit.addEventListener('click', getResultXml, false);
//}
//
//function getResultXml(event){
//	
//	var queryKeyword = document.getElementById("search_box").children[0].value; 
//	var incompleteUrl = "/search?searchKeyword=";
//	
//	var callback = function(request){
//		
//		var aResult = JSON.parse(request.responseText); //json을 파싱해서 object로 넣는
//		console.log(aResult);
//		if(aResult.length == 0){
//			oTemplate.showDefaultTemplate("pc_search", ".comment", "검색 결과가 존재하지 않습니다.")
//		} else {
//			
//			//template element가져오기
//			var eTemplate = document.getElementById("template").querySelector(".search");			
//			//aResult를 for문을 돌며 template element를 복사한 변수를 가져와서 데이터 삽입 
//			var eTarget = document.getElementById("pc_search").querySelector("ul");
//			//이미 존재하는 검색 결과가 있다면 지운다.
//			while (eTarget.firstChild) {
//				eTarget.removeChild(eTarget.firstChild);
//			}
//			
//			for( var i = 0 ; i < aResult.length ; ++i){
//				var eCopiedTemplate = eTemplate.cloneNode(true);
//				var eSearchedTitle = eCopiedTemplate.querySelector(".title");
//				var eSearchedCategory = eCopiedTemplate.querySelector(".category");
//				var eSearchedAddress = eCopiedTemplate.querySelector(".address");
//				
//				eSearchedTitle.innerHTML = aResult[i]["title"]; 
//				eSearchedCategory.innerText = aResult[i]["category"]; 
//				eSearchedAddress.innerText = aResult[i]["address"];
//				eCopiedTemplate["cartesianX"] = aResult[i]["mapx"];
//				eCopiedTemplate["cartesianY"] = aResult[i]["mapy"];
//				
//				//template을 원하는 위치에 삽입
//				eTarget.appendChild(eCopiedTemplate);
//			}
//		}
//	};
//	oAjax.getObjectFromJsonGetRequest(incompleteUrl, queryKeyword, callback);
//}
//
//oTemplate = {
//		//이전에 넣었던 templates 지우기
//		deletePreviousTemplate : function(eTarget){
//			while(eTarget.firstChild) {
//				eTarget.removeChild(eTarget.firstChild);
//			}
//		},
//		showDefaultTemplate: function(targetPosId, targetContentsSelector, sExplanation){
//			var eDefaultTemplate = document.getElementById("template").querySelector(".default");
//			var eTarget = document.getElementById(targetPosId).querySelector("ul");
//
//			this.deletePreviousTemplate(eTarget);
//
//			var eCopiedDefaultTemplate = eDefaultTemplate.cloneNode(true);
//			eCopiedDefaultTemplate.querySelector(targetContentsSelector).innerText = sExplanation;
//
//			eTarget.appendChild(eCopiedDefaultTemplate);
//		},
//		specifyTemplate : function(aResponse, eDefaultTemplate, eTarget, callback){
//			for( var i = 0 ; aResponse.length ; ++i){
//				var eCopiedDefaultTemplate = eDefaultTemplate.cloneNode(ture);
//				callback(aResponse[i], eDefaultTemplate);
//				eTarget.appendChild(eCopiedDefaultTemplate);
//			}
//		}
//};
//
//window.onload = initialize();