function initPage() {
	var COOKIE_EMAIL = "member.lastLoggedEmail";
	var lastLoggedEmail = getCookieValue(COOKIE_EMAIL);
	
	fillEmail(lastLoggedEmail);
	
	document.getElementById('join_form').onsubmit = validateEmail;	
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

function fillEmail(email) {
	if (email == "") {
		return ;
	}
	
	var loginForm = document.forms[0];
	var inputEmail = loginForm.querySelector("input[name=\"email\"]");
	
	inputEmail.value = email;
}

function validateEmail() {
	var newbieEmail = document.getElementById("joinEmail").value;
	var emailFormat = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
	if (emailFormat.test(newbieEmail)) {
			return true;
		} else {
			alert( newbieEmail + " does not fit to email address form " )
			return false;
		}
}

window.onload = initPage;