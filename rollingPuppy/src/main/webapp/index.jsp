<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Rolling Puppy</title>
	<meta name="viewport" content="width=device-width", initial-scale=5.0, user-scalable=no />
	<link rel="stylesheet" type="text/css" href="/stylesheets/index.css?20140501">
	<script src="/javascripts/index.js?20140501"></script>
</head>

<body>
<body>
	<div class="bgImg"></div>
	<div class="interactBox">
		<h1 class="title">
			Welcome. Please login.
		</h1>
		<p>
			<span>Welcome My Neighbor</span>
		</p>

		<div class="choiceBlock">
			<a href="#" class="choice c_login">LOGIN</a>
			<a href="#" class="choice c_join">JOIN</a>
			<span class="devider">OR</span>
		</div>

		<div class="loginArea">
			<form id="login_form" action="/login" method="post">
				<p>
					<input type="text" id="loginEmail" name="email" placeholder="Email" />
				</p>
				<p>
					<input type="password" name="password" placeholder="Password" />
				</p>
				<p>
					<input type="checkbox" name="keepEmail"  value="true"> 이메일 저장하기
				</p>
				<p>
					<input type="submit" id="login_button" value="Enter House" />
				</p>
			</form>
		</div>
		
		<div class="joinArea">
			<form id="join_form" action="/join" method="post">
				<p>
					<input type="text" id="joinEmail" name="email" placeholder="Email" />
					<p id="duplicateCheck"></p>
				</p>
				<p>
					<input type="password" name="password" placeholder="Password" />
				</p>
				<p>
					<input type="password" name="passwordConfirm" placeholder="Password Confirm" />
				</p>
				<p>
					<input type="radio" value="M" name="radio-input" checked="checked">Male
					<input type="radio" value="W" name="radio-input">Female
				</p>
				<p>
					<input type="submit" value="Sign In" />
				</p>
			</form>
		</div>
	</div>
</body>
</html>