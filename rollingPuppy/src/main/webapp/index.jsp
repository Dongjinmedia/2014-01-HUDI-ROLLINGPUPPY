<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Rolling Puppy</title>
	<link rel="stylesheet" type="text/css" href="/stylesheets/reset.css">
	<link rel="stylesheet" type="text/css" href="/stylesheets/default.css">
	<link rel="stylesheet" type="text/css" href="/stylesheets/index.css">
	<script src="/javascripts/index.js"></script>
</head>

<body>
<div id="wrapper">
	<div id="header">
		<h1><a href="/">Rolling Puppy</a></h1>
		<div id="loginBox">
			<form action="/login" method="post" id="login_form" >
				<input type="text" name="email" placeholder="Email" id="loginEmail">
				<input type="password" name="pw" placeholder="Password">
				<input type="submit" id="login_button" value="login" class="button" >
				<div id="checkbox">
					<input type="checkbox" name="keepLogin"  value="true"> 로그인 유지
				</div>
			</form>
		</div>
	</div>
	
	<div id="contentsWrapper">
		<div id="joinBox">
			<form action="/join" method="post" id="join_form" >
				<input type="text" name="email" id="joinEmail" placeholder="Email">
				<input type="password" name="password" placeholder="Password">
				<input type="password" name="passwordConfirm" placeholder="Password Confirm">
				<div>
					<input type="radio" value="M" name="radio-input" checked="checked">Male
					<input type="radio" value="W" name="radio-input">Female
				</div>
				<input type="submit" id="join_button" value="Sign In" class="button" >
				</form>
		</div>
	</div>
</div>
</body>

</html>