//Ajax 통신을 담당하는 모듈 Object
var oAjax = {
		//Ajax GET 요청함수
		//내부적으로 _getObjectFromJsonRequest 호출
		getObjectFromJsonGetRequest: function (incompleteUrl, sParameters, callback) {
			var url = incompleteUrl + sParameters;
			var oParameters = null;
			this._getObjectFromJsonRequest(url, "GET", oParameters, callback);
		},
		
		//Ajax POST 요청함수
		//내부적으로 _getObjectFromJsonRequest 호출
		getObjectFromJsonPostRequest: function (url, oParameters, callback) {
			this._getObjectFromJsonRequest(url, "POST", oParameters, callback);
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
			request.onload = function() {
				if ( typeof callback == "function" ) {
					callback(request);
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

//template을 담당하는 객체
oTemplate = {
		//template element 
		eDefaultTemplate : null,
		//삽입할 위치의 기준이 되는 element
		eTarget : null, 
		//삽입할 컨텐츠 tag 
		aInnerContents : null,
		//컨텐츠를 삽입하는 element
		aInnerContentsElement: null,
		//이전에 넣었던 templates 지우기
		deletePreviousTemplate : function(eTarget){
			while(eTarget.firstChild) {
				eTarget.removeChild(eTarget.firstChild);
			}
		},
		specifyTemplate : function(oResponse, eDefaultTemplate, eTarget,  ){
			//여기안에 for 문 이하 다 넣을 것 
		},
		//쓸데없이 세분화 한듯
		//copy template node
		copyTemplate : function(eDefaultTemplate){
			var eCopiedDefaultTemplate = eDefaultTemplate.cloneNode(true);
			return eCopiedDefaultTemplate;
		},
		matchElement : function(eCopiedDefaultTemplate, nodeSelector) {
			return eCopiedDefaultTemplate.querySelector(nodeSelector);
		},

		//aInnerContents = [".title", ".category", ".address"];
		//aInnerContents = ["title", "category", "address"];
		//var aInnerContentsElement[i] = aInnerContents[i];
		//aInnerContentsElement[i] = this.matchElement(eCopiedDefaultTemplate, aInnerContents[i]);

		//template에 내용 넣기
		fillTemplateContents: function( aResponse, aInnerContents, aInnerContentsElement){
			for ( var i = 0 ; i < aInnerContents.length < ++i ){
				aInnerContentsElement[i].innerHTML =aResponse[i][aInnerContents[i]];
			}
		},
		//template을 원하는 위치에 삽입
		insertTemplate : function(eTarget, eCopiedDefaultTemplate){
			eTarget.appendChild(eCopiedDefaultTemplate);
		},

		//이거 필요 없을 듯 
		initialize: function(){ 
		}
};