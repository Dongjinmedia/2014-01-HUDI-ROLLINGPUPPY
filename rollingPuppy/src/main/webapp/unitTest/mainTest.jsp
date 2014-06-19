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
		<!-- Test For Alert Component -->
		<ul id="noticeBox"></ul>
		
		<!-- Test For Login Choice Box -->
		<div class="header">
			<h1 class="title">Welcome!</h1>
			<p>Welcome My Neighbor</p>
		</div>
		<div class="choiceBlock">
				<a href="#" class="choice c_login">LOGIN</a>
				<a href="#" class="choice c_join">JOIN</a>
				<span class="devider">OR</span>
			</div>
		<div class="loginArea"></div>
		<div class="joinArea"></div>
	</div>
</body>
<script type="text/javascript" src="/javascripts/main.js"></script>
<script type="text/javascript" src="/javascripts/index.js"></script>
<script type="text/javascript" src="/unitTest/lib/fireEvent.js"></script>
<script type="text/javascript" src="/unitTest/lib/qunit.js?v=1.14.0"></script>
<script type="text/javascript" src="/unitTest/mainTest.js?v=1.14.0"></script>
</html>