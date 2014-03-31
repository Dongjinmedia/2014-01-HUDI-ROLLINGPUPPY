<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Join Page</title>
</head>
<body>
Join Page
<form action="/join"  method="post">
	<input type="text" name="email" placeholder="Email"/>
	<br/>
	<input type="password" name="password" placeholder="Password"/>
	<br/>
	<input type="password" name="passwordConfirm" placeholder="Password Confirm"/>
	<br/>
	<input type="radio" value="M" name="radio-input" checked="checked">Men</input>
	<input type="radio" value="W" name="radio-input" >Woman</input>
	<br/>
	<input type="submit" value="전송"/>
</form>
</body>
</html>