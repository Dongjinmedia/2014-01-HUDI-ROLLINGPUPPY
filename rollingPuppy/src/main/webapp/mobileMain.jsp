<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" isELIgnored="false"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
<title>Neighbor</title>
<link rel="stylesheet" type="text/css" href="/stylesheets/reset.css">
<link rel="stylesheet" type="text/css"
	href="/stylesheets/mobileMain.css">
</head>

<body>
	<input type="hidden" id="email" value="${sessionScope['member.email']}" />
	<input type="hidden" id="id" value="${sessionScope['member.id']}" />
	<!-- hidden Area2 (For Entered Chatting Room List) -->
	<div style="display: none;">
		<p id="enteredChattingRoomList">${requestScope["enteredChattingRoomList"]}</p>
	</div>
	
	<div id="template" class="hidden" style="display: none;">
		<ul>
			<li class="card default">
				<p class="icon-warning"></p>
				<p class="comment">현재 리스트가 없습니다.</p>
			</li>
			<li class="card chatRoom">
				<p class="title icon-chatting">강남역 지하상가안내</p>
				<p class="limit icon-participant">4 / 30</p>
				<p class="address icon-title">대한민국 서울특별시 강남구 역삼동 821-1 강남역</p>
				<div class="notification" style="display: inline-block;">5</div>
			</li>
			<li class="card cell search">
				<p class="title icon-title"></p>
				<p class="category"></p>
				<p class="address"></p>
			</li>
			
			<li class="person chatMember">
				<span class="profile"></span>
				<p class="nickname adjective"></p>
				<p class="nickname noun"></p>
			</li>
			
			<li class="notice">
				<span class="message"></span>
			</li>
								
			<li class="user">
				<span class="time"></span>
				<span class="message"></span>
			</li>
								
			<li class="other">
				<span class="profile"></span>
				<span class="nickname"></span>
				<span class="message"></span>
				<span class="time"></span>
			</li> 
		</ul>
	</div>

	<!-- 채팅방 영역 -->
	<div id="chatWindow">
		<div class="leftArea">
			<div class="top">
				<p class="title icon-chatting">모여라 꿈동산 여기는 판교판교</p>
				<div class="menu">
					<div class = "leftMenu">
						<i class="icon-aside" title="접어두기"></i>
						<i class="icon-exit" title="채팅방 나가기"></i>
					</div>
					<div class = "rightMenu">
						<i class ="icon-member" title="채팅멤버 보여주기"></i>
					</div>
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
				<input type = "button" value = "send"></input>
			</div>
		</div>
		<div class="rightArea fold">
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
	
	<!-- 검색창과 로고를 포함한 header -->
	<header>
		<div id="logo">
			<a href="/mobile"></a>
		</div>
		<!-- sf = searchForm  -->
		<div id="sf_wrapper">
			
			<div id="sf"> 
				<!-- sb = searchBox(검색창) -->
				<div id="sb_wrapper">
					<div id="sb_positioner">
						<input id="searchBox" type="text"></input>
					</div>
				</div>
				<div class="submit">검색</div>
			</div>
		</div>
	</header>

	<div id="nav">
		<div id="account"></div>
		<div id="nav_menu">
			<div class="on">
				<a href="#">검색</a>
			</div>
			<div>
				<a href="#">채팅방</a>
				<div class="notification">0</div>
			</div>
			<div>
				<a href="#">관심장소</a>
			</div>
			<div>
				<a href="#">설정</a>
			</div>
		</div>
	</div>

	<div id="panel_wrapper">
		<div id="panel">
			<div id="panel_contents">
				<div class="section_wrapper">
					<div id="scroll0" class="scroll_wrapper">
						<div class="scroll_area">
							<h1>검색</h1>
							<ul class="section">
								<li class="card cell search">
									<p class="title icon-title">카페 에이에이 삼청동점</p>
									<p class="category">카페, 디저트>카페]</p>
									<p class="address">서울특별시 중구 명동 2가 52-8 은좌빌팅 1,2층여기거기여가거가
										우리우</p>
								</li>
								<li class="card cell search">
									<p class="title icon-title">제목입니당</p>
									<p class="category">카테고리고리</p>
									<p class="address">주소주소주</p>
								</li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
							</ul>
						</div>
					</div>
				</div>
				<div class="section_wrapper">
					<div id="scroll1" class="scroll_wrapper">
						<div class="scroll_area">
							<h1>채팅방</h1>
							<ul class="section">
								<li class="card chatRoom">
									<p class="title icon-chatting">강남역 지하상가안내</p>
									<p class="limit icon-participant">4 / 30</p>
									<p class="address icon-title">대한민국 서울특별시 강남구 역삼동 821-1 강남역</p>
									<div class="notification" style="display: inline-block;">5</div>
								</li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
							</ul>
						</div>
					</div>
				</div>
				<div class="section_wrapper">
					<div id="scroll2" class="scroll_wrapper">
						<div class="scroll_area">
							<h1>관심장소</h1>
							<ul class="section">
								<li class="card default">
									<p class="icon-warning"></p>
									<p class="comment">현재 리스트가 없습니다.</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="section_wrapper">
					<div id="scroll3" class="scroll_wrapper">
						<div class="scroll_area">
							<h1>설정</h1>
							<ul class="section">
								<li class="card default">
									<p class="icon-warning"></p>
									<p class="comment">현재 리스트가 없습니다.</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div id="panel_buttons">
				<div id="fold">
					<div class="panelFold"></div>
				</div>
				<div id="unfold">
					<div class="panelUnfold"></div>
				</div>
			</div>
		</div>
	</div>

	<div id="map"></div>

	<footer></footer>
	<script type="text/javascript" src="/javascripts/ajax.js?20140607"></script>
	<script type="text/javascript" src="/javascripts/mobileMain.js?20140607"></script>
	<script type="text/javascript" src="/javascripts/iscroll.js"></script>
	<script type="text/javascript">
		window.onload = function() {
			document.addEventListener("touchmove", function(event) {
				event.preventDefault();
			});
			initialize();
		}
	</script>
	<!-- <script type="text/javascript" src="http://127.0.0.1:3080/socket.io/socket.io.js"></script> -->
	<script type="text/javascript" src="http://10.73.43.102:3080/socket.io/socket.io.js"></script>
</body>
</html>
