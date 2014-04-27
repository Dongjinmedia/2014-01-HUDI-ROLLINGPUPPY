function initPage() {
	var COOKIE_EMAIL = "member.lastLoggedEmail";
	var lastLoggedEmail = getCookieValue(COOKIE_EMAIL);
	
	fillEmail(lastLoggedEmail);
	
	document.getElementById('join_form').onsubmit = validateEmail;	
	document.getElementById('login_form').onsubmit = validateEmail;
}

/**
 * 인자로 넘겨받은 이름으로 쿠키를 찾아서 value를 반환니다. 
 * @param name
 * @returns value
 */
function getCookieValue(name) {
	var arrayCookieProperties = document.cookie.split(';');
	for (var idx = 0; idx < arrayCookieProperties.length; idx++) {
		var cookieProperty = arrayCookieProperties[idx].trim();
		if (cookieProperty.indexOf(name + "=") === 0) {
			var value = cookieProperty.substring(name.length + 1, cookieProperty.length);
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
	var inputEmail = loginForm.querySelector("input[name=\"email\"]");
	
	inputEmail.value = email;
}

//input tag의 name 이 email인 곳에 email형식에 맞게 input이 들어왔는지 정규 표현식을 이용해 확인하는 함
function validateEmail() {
	
	var emails = document.getElementsByName("email");
	var emailFormat = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
	for(i = 0 ; i< emails.length ; i++) {
		if(emails[i].value != "") {
			if(emailFormat.test(emails[i].value)) {
				return true;
			} else {
				alert (emails[i].value + "\ndoes not fit to email address form"); 
			}
		}
	}
}

//	var newbieEmail = document.getElementById("joinEmail").value;
//	var emailFormat = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
//	if (emailFormat.test(newbieEmail)) {
//			return true;
//		} else {
//			alert( newbieEmail + " does not fit to email address form " );
//			return false;
//		}
//}

window.onload = initPage;