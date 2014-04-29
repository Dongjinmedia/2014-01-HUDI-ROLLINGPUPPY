function initPage() {
	var COOKIE_EMAIL = "member.lastLoggedEmail";
	var lastLoggedEmail = getCookieValue(COOKIE_EMAIL);
//	var emailToBeChecked = null;
	
	fillEmail(lastLoggedEmail);

	document.getElementById("join_form").onsubmit = validateJoinEmail;	
	document.getElementById("login_form").onsubmit = validateLoginEmail;

	//윤성소스 추가
	document.querySelector(".c_login").addEventListener('click', loginChoiceONOFF, false);
	document.querySelector(".c_join").addEventListener('click', joinChoiceONOFF, false);
	//end
	
	//duplicate Email check
	document.getElementById("joinEmail").addEventListener('keyup',duplicateEmail,false);
	
}

/**
 * 인자로 넘겨받은 이름으로 쿠키를 찾아서 value를 반환니다. 
 * @param name
 * @returns value
 */
function getCookieValue(name) {
	var arrayCookieProperties = document.cookie.split(";");
	for (var idx = 0; idx < arrayCookieProperties.length; idx++) {
		var cookieProperty = arrayCookieProperties[idx].trim();
		if (cookieProperty.indexOf(name + "=") === 0) {
			var value = cookieProperty.substring(name.length + 2, cookieProperty.length -1);
			return value;
		}
		
		return null;
	}
}

//마지막으로 로그인 된 email 값을 login email box에 default로 삽입 
function fillEmail(email) {
	if (email == "") {
		return ;
	}
	
	var loginForm = document.forms[0];
	var inputEmail = loginForm.querySelector("input[name=email]");
	
	inputEmail.value = email;
}

//email validation check를 하는 함수
//두 개의 submit 버튼중 어떤 버튼이 눌렸는지 즉, 어느 칸에 입력된 email에 대하여 validation check를 할 것인지 찾는 함수 
//function checkClickedButtonJoin() {
//	var emailToBeChecked = document.getElementById("joinEmail").value;​
//	validateEmail(emailToBeChecked);
//}
//
//function checkClickedButtonLogin() {
//	var emailToBeChecked = document.getElementById("loginEmail").value;​
//	validateEmail(emailToBeChecked);
//}

//input tag의 name 이 email인 곳에 email형식에 맞게 input이 들어왔는지 정규 표현식을 이용해 확인하는 함수 
function validateJoinEmail() {
	var newbieEmail = document.getElementById("joinEmail").value;
	var emailFormat = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
	if (emailFormat.test(newbieEmail)) {
			return true;
		} else {
			alert( newbieEmail + " does not fit to email address form " );
			return false;
		}
}

function validateLoginEmail() {
	var oldbieEmail = document.getElementById("loginEmail").value;
	var emailFormat = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
	if (emailFormat.test(oldbieEmail)) {
			return true;
		} else {
			alert( oldbieEmail + " does not fit to email address form " );
			return false;
		}
}

//****************************************************윤성소스 추가 시작
function getStyleValue(node, style) {
	var totalStyle= window.getComputedStyle(node , null);
	return totalStyle.getPropertyValue(style);
}

function loginChoiceONOFF() {
	event.preventDefault();
	
	var loginNode = document.querySelector(".loginArea");
	var loginNodeStyle = getStyleValue(loginNode, "display");
	var titleNode = document.querySelector(".title");
	titleNode.innerHTML = "Welcome. Please login.";
	titleNode.nextElementSibling.innerHTML = "Cozy Home is waiting for you.";
	
	
	if ( loginNodeStyle == "none" )
		loginNode.style.display="block";
	else
		loginNode.style.display="none";

	loginNode.nextElementSibling.style.display="none";
}

function joinChoiceONOFF() {
	event.preventDefault();
	
	var loginNode = document.querySelector(".joinArea");
	var loginNodeStyle = getStyleValue(loginNode, "display");
	var titleNode = document.querySelector(".title");
	
	titleNode.innerHTML = "Be My Neighbor";
	titleNode.nextElementSibling.innerHTML = "And Chat On The Map";
	
	if ( loginNodeStyle == "none" )
		loginNode.style.display="block";
	else
		loginNode.style.display="none";

	loginNode.previousElementSibling.style.display="none";
}


//****************************************************윤성소스 추가 끝

//id 중복 체크를 위한 함수 
function duplicateEmail(){
	console.log("check!!");
	var newbieEmail = document.getElementById("joinEmail").value;
	var url = "/join?email="+newbieEmail;
	
	var request = new XMLHttpRequest();
	request.open("GET", url , true );
	request.onreadystatechange = function(){
		if ( request.readyState === 4 && request.status === 200 ) {
			var isExisted = request.responseText;
			console.log(	isExisted);
			console.log(isExisted == 'true' );
			console.log(isExisted == "true" );
			console.log(isExisted === "true" );
			
			if( isExisted == true){
				alert("already exist");
			}
		}
	}
	request.send(); //request를 보내는것 callback 함수당 
}



window.onload = initPage;
