<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
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
		<a href="/"><h1>Rolling Puppy</h1></a>
		<div id="loginBox">
			<form action="/login" method="post">
				<input type="text" name="email" placeholder="Email">
				<input type="password" name="pw" placeholder="Password">
				<input type="submit" value="login" class="button">
				<div id="checkbox">
					<input type="checkbox" name="keepLogin"  value="true"> 로그인 유지
				</div>
			</form>
		</div>
	</div>
	
	<div id="contentsWrapper">
		<div id="joinBox">
			<form action="/join"  method="post">
				<input type="text" name="email" placeholder="Email">
				<input type="password" name="password" placeholder="Password">
				<input type="password" name="passwordConfirm" placeholder="Password Confirm">
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