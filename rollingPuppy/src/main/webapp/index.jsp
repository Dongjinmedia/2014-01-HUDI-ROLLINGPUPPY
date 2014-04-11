<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Rolling Puppy</title>
	<link rel="stylesheet" type="text/css" href="/stylesheets/reset.css">
	<link rel="stylesheet" type="text/css" href="/stylesheets/index.css">
	<script src="/javascripts/index.js"></script>
</head>

<body>
<div id="wrapper">
	<div id="header">
		<div id="loginBox">
			<form action="/login" method="post">
				<input type="text" name="email" class="loginField" placeholder="Email">
				<input type="password" name="pw" class="loginField" placeholder="Password">
				<input type="submit" value="login"  id="loginButton" class="button">
				<input type="checkbox" name="keepLogin"  value="true"> 로그인 유지
			</form>
		</div>
	</div>
	
	<div id="contentsWrapper">
		<div id="joinBox">
			<form action="/join"  method="post">
				<input type="text" name="email" class="joinField" placeholder="Email">
				<input type="password" name="password" class="joinField" placeholder="Password">
				<input type="password" name="passwordConfirm" class="joinField" placeholder="Password Confirm">
				<div>
					<input type="radio" value="M" name="radio-input" checked="checked">Male
					<input type="radio" value="W" name="radio-input">Female
				</div>
				<input type="submit" value="Sign In" class="button">
				</form>
		</div>
	</div>
</div>
</body>

</html>