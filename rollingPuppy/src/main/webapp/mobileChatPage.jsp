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
	<div id="chatWindow">
		<div class="leftArea">
			<div class="top">
				<p class="title icon-chatting">모여라 꿈동산 여기는 판교판교</p>
				<p class="limit icon-participant">1 / 300</p>
				<p class="address icon-title">삼평동 H스퀘어 N동 4층 NHN NEXT</p>
				<div class="menu">
					<i class="icon-aside" title="접어두기"></i>
					<i class="icon-exit" title="채팅방 나가기"></i>
			</div>
			</div>
			<div class="middle">
				<ul class="chattingContents">
					<!--<li>안녕하니?</li>
					<li>웅 안녕못해</li>
					<li>싸울래?</li>
					<li>미안 잘못했어ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ</li>-->
					 <li class="notice">
						<span class="message">날으는 정윤성님이 참여하였습니다.</span>
					</li>
					
					<li class="user">
						<span class="time">AM 11:07</span>
						<span class="message">안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?안녕하니?</span>
					</li>
					
					<li class="other">
						<span class="profile"></span>
						<span class="nickname">날으는 정윤성</span>
						<span class="message">웅 안녕못해</span>
						<span class="time">AM 1:07</span>
					</li> 
				</ul>
			</div>
			<div class="bottom">
				<textarea class="inputArea" name="chat-window-message" autofocus></textarea>
			</div>
		</div>
		<div class="rightArea unfold">
			<div class="chattingMemberList">
				<ul>
					<li class="person chatMember"><img class="profile"
						src="https://cdn1.iconfinder.com/data/icons/gnomeicontheme/32x32/stock/generic/stock_person.png">
						<p class="nickname adjective">날아라</p>
						<p class="nickname noun">윤성</p></li>

					<li class="person chatMember"><img class="profile"
						src="https://cdn1.iconfinder.com/data/icons/gnomeicontheme/32x32/stock/generic/stock_person.png">
						<p class="nickname adjective">꿀렁꿀렁</p>
						<p class="nickname noun">윤성</p></li>
				</ul>
			</div>
		</div>
	</div>
</body>
</html>