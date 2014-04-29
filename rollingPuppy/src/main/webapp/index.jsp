<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Rolling Puppy</title>
	
	<link rel="stylesheet" type="text/css" href="/stylesheets/index.css">
	<script src="/javascripts/index.js"></script>
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
					<input type="password" name="pw" placeholder="Password" />
				</p>
				<p>
					<input type="submit" id="login_button" value="Enter House" />
				</p>
				<p>
					<input type="checkbox" name="keepLogin"  value="true"> 로그인 유지
				</p>
			</form>
		</div>
		
		<div class="joinArea">
			<form id="join_form" action="#" method="post">
				<p>
					<input type="text" id="joinEmail" name="email" placeholder="Email" />
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
	<script src="/javascripts/index.js"></script>
</body>
</html>