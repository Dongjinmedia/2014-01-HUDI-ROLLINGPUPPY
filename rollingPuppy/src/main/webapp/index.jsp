<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="/rollingPuppy/stylesheets/reset.css" />
<title>Rolling Puppy</title>

<style type="text/css">

body {
	margin: 0;
	height: 100%;
}

div {
	
}

a {
	text-decoration: none;
}

.button {
	display: inline-block;
	color: #FFFFFF;
	border: 1px solid #0077FF;
	background-color: #0077FF;
	padding: 7px 6px;
	text-decoration: none;
	font-size: 12px;
	font-weight: 600;

	border-radius: 3px;
	-webkit-border-radius: 3px;
}

#wrapper {
	position: absolute;
	min-width: 1000px;
	min-height: 600px;
	width: 100%;
	height: 100%; 
}

#header {
	position : relative;
	height : 50px;
	background-color: #EEE;
}

#loginBox {
	position: absolute;
	margin-top: 7px;
	right: 20px;
	font-size: 13px;
}

.loginField {
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border: 1px solid #ccc;
    display: inline-block;
    font-size: 14px;
    padding: 6px 8px;
    width: 180px;
}

#loginButton {
	padding: 5px 4px;
}
^
#contentsWrapper  {
}

#joinBox {
	position: absolute;
	top: 50%;
	left: 50%;
	margin-left: -143px;
	margin-top: -113px;
	font-size: 13px;
	padding: 30px 40px;
	border: 4px solid #EEE;
	border-radius: 6px;
}

#joinBox > form >  input {
	display: block;
}

.joinField {
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border: 1px solid #ccc;
    display: inline-block;
    font-size: 16px;
    padding: 6px 8px;
    width: 180px;
}

</style>

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