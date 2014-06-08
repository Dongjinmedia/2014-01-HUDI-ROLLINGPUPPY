<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
	 
	 <title>mobileChatPage</title>
	<link rel="stylesheet" type="text/stylesheet" href="/stylesheets/reset.css">
	<link rel="stylesheet" type="text/stylesheet" href="/stylesheets/mobileChatPage.css">
</head>
<body>
	
</body>
<script type="text/javascript" src="/javascripts/mobileChat.js?20140521"></script>
<script>
window.onload=oMemberPanel.init();
</script>
<!--하면 채팅 내용부분만 스크롤이 됨. 원래 의도는 주소창을 없애는 것이었음
<script type="text/javascript">
if (navigator.userAgent.indexOf('iPhone') != -1) { 
	addEventListener("load", function() 
	{ 
	setTimeout(hideURLbar, 0); 
	}, false); 
}

function hideURLbar() { 
	window.scrollTo(0, 1); 
}
</script> 
-->
</html>