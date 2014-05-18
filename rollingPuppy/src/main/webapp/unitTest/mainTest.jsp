<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Javascript Unit Test</title>
	<link rel="stylesheet" href="/unitTest/lib/qunit.css?v=1.14.0">
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
</head>
<body>
	<div id="qunit"></div>
	<div id="qunit-fixture">
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
	</div>
</body>
<script type="text/javascript" src="/javascripts/main.js"></script>
<script type="text/javascript" src="/javascripts/index.js"></script>
<script type="text/javascript" src="/unitTest/lib/fireEvent.js"></script>
<script type="text/javascript" src="/unitTest/lib/qunit.js?v=1.14.0"></script>
<script type="text/javascript" src="/unitTest/mainTest.js?v=1.14.0"></script>
</html>