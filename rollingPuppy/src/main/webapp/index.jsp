<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Rolling Puppy</title>
	<meta name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
	<link rel="stylesheet" type="text/css" href="/stylesheets/reset.css">
	<link rel="stylesheet" type="text/css" href="/stylesheets/index.css?20140501">
	<script type="text/javascript" src="/javascripts/ajax.js?20140522"></script>
	<script src="/javascripts/index.js?20140522"></script>
</head>

<body>
<body>
	<div class="header">
		<h1 class="title">Welcome!</h1>
		<p>Welcome My Neighbor</p>
	</div>
	
	<div class="interactBox">
		<div class="choiceBlock">
			<a href="#" class="choice c_login clicked">LOGIN</a>
			<a href="#" class="choice c_join">JOIN</a>
			<span class="devider">OR</span>
		</div>

		<div class="loginArea">
			<form id="login_form" action="/login" method="post">
				<input type="text" id="loginEmail" name="email" placeholder="Email">
				<input type="password" name="password" placeholder="Password">
				<input type="checkbox" name="keepEmail"  value="true"> Keep Email Address
				
				<input type="submit" id="login_button" value="Sign In">
			</form>
		</div>
		
		<div class="joinArea">
			<div id="duplicateCheck">
				<div class="dc_pass"></div>
				<div class="dc_fail">사용중!</div>
				<div class="dc_form">...</div>
			</div>
			<form id="join_form" action="/join" method="post">
				<input type="text" id="joinEmail" name="email" placeholder="Email" />
				<input type="password" name="password" placeholder="Password" />
				<input type="password" name="passwordConfirm" placeholder="Password Confirm" />

				<input type="radio" value="M" name="radio-input" checked="checked">Male
				<input type="radio" value="W" name="radio-input">Female

				<input type="submit" id="join_button" value="Sign Up" />
			</form>
		</div>
		
	</div>
	
	<div class="bgImg">
		<div class="innerbg"></div>
	</div>
	
	<script type="text/javascript">
		window.onload = function() {
			document.addEventListener("touchmove", function(event) {
				event.preventDefault();
			});
			
			initialize();
		}
	</script>
</body>
</html>