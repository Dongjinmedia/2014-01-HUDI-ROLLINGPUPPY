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
<script type="text/javascript"
	src="http://openapi.map.naver.com/openapi/naverMap.naver?ver=2.0&key=5c935084c09a23e331aee090a0f2270c"></script>
<script type="text/javascript"
	src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
</head>

<body>
	<script type="text/template" class="hidden" id = "enteredChatInfoObject">${requestScope["enteredChatInfoObject"]}</script>
 	<script type="text/template" class="hidden" id = "bookmarkList">${requestScope["bookmarkList"]}</script>
 	<script type="text/template" class="hidden" id="email">${sessionScope['member.email']}</script>
 	<script type="text/template" class="hidden" id="id">${sessionScope['member.id']}</script>	
	
	<div id="markerInfo">
		<div class="mi_header">
			<div class="mi_foldButton"></div>
		</div>
		<div class="mi_body">
			<div class="mi_info">
				<p class="address icon-title">대한민국 서울특별시 강남구 역삼동 737 역삼</p>
				<div class="mi_bookmarkButton"><div>관심장소 추가</div></div>
				<div class="mi_addChatRoomButton"><div>채팅방 만들기</div></div>
			</div>
			<div class="mi_chatRoomList">
				<div id="marker_scroll" class="scroll_wrapper">
					<div class="scroll_area">
						<ul class="section">
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
		
	<div id="createChatRoom">
		<div class="outer bg"></div>
		<div class="centerArea">
			<p class="cancle">✕</p>
			<div class="inner bg"></div>
			<div class="ccr_inputArea">
				<p class="createAddress">성남시 분당구 삼평동 H스퀘어 N동 4층 NHN NEXT</p>
				<form action="/room" method="post">
					<p>
						<label class="icon-chatting"></label> <input class="roomName"
							type="text" name="title" placeholder="Room name" />
					</p>
					<p>
						<label class="icon-people"></label> <input class="limitNum"
							type="number" name="max" placeholder="Limit Number" />
					</p>
					<input type="submit" value="Create Chatting Room" />
				</form>
			</div>
		</div>
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
				<div class="notification"></div>
			</li>
			<li class="card search">
				<p class="title icon-title"></p>
				<p class="category"></p>
				<p class="address"></p>
			</li>
			<li class="card bookmark">
				<p class="title icon-bookmark"></p>
				<i class="icon-delete"></i>
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
				<div id="chat_scroll" class="scroll_wrapper">
					<div class="scroll_area">
						<ul class="chattingContents"></ul>
					</div>
				</div>
			</div>
			<div class="bottom">
				<div class="input_wrapper">
					<div class="input_positioner">
						<textarea class="inputArea" name="chat-window-message"></textarea>
					</div>
				</div>
				<div class="send">전송</div>
			</div>
		</div>
		<div class="rightArea">
			<div class="chattingMemberList">
				<ul>
				</ul>
			</div>
		</div>
	</div>
	
	<!-- 검색창과 로고를 포함한 header -->
	<header>
		<div id="logo">
			<a></a>
		</div>
		<!-- sf = searchForm  -->
		<div id="sf_wrapper">
			
			<div id="sf"> 
				<div class="input_wrapper">
					<div class="input_positioner">
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
				<a>검색</a>
			</div>
			<div>
				<a>채팅방</a>
				<div class="notification">0</div>
			</div>
			<div>
				<a>관심장소</a>
			</div>
			<div>
				<a>설정</a>
			</div>
		</div>
	</div>

	<div id="panel_wrapper">
		<div id="panel">
			<div id="panel_contents">
				<div class="section_wrapper">
					<div id="panel_scroll0" class="scroll_wrapper">
						<div class="scroll_area">
							<h1>검색</h1>
							<ul class="section">
								<li class="card default">
									<p class="icon-warning"></p>
									<p class="comment">상단의 검색창을 이용해주세요.</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="section_wrapper">
					<div id="panel_scroll1" class="scroll_wrapper">
						<div class="scroll_area">
							<h1>채팅방</h1>
							<ul class="section">
								<li class="card default">
									<p class="icon-warning"></p>
									<p class="comment">참여중인 채팅방이 없습니다.</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="section_wrapper">
					<div id="panel_scroll2" class="scroll_wrapper">
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
					<div id="panel_scroll3" class="scroll_wrapper">
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
		<!-- 컨텐츠 영역에서 네비게이션과 패널 영역을 제외한, 지도를 포함한 영역-->
			<div id='mapClicker'>
				<div class="locationName">
					<div></div>
				</div>
				<div class='marker'></div>
				<div class='pulse'></div>
				<div class='clickerMenu'>
					<i class="clicker icon-add"></i> <i class="clicker icon-star"></i>
				</div>
			</div>
		<div id="map">
			<!-- 지도 영역 -->
			<div id="naver_map" class="naver_map"></div>
		</div>
	</div>


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
	<script type="text/javascript" src="http://125.209.195.202:3080/socket.io/socket.io.js"></script>
</body>
</html>
