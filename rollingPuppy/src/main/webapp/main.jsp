<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" isELIgnored="false"%>
<!DOCTYPE html>
<html>
<%!final String SESSION_NICKNAME_NOUN = "member.nickname_noun";
	final String SESSION_NICKNAME_ADJECTIVE = "member.nickname_adjective";%>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Neighbor</title>
<link type="text/css" rel="stylesheet"
	href="/stylesheets/reset.css?20140501">
<link type="text/css" rel="stylesheet"
	href="/stylesheets/main.css?20140504">
<script type="text/javascript"
	src="http://openapi.map.naver.com/openapi/naverMap.naver?ver=2.0&key=f154abb26c9c79ed5a4a25d000a9349c"></script>
<script type="text/javascript"
	src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
</head>

<body>
	<div id="template" class="hidden" style="display: none;">
		<ul>
			<li class="cell none">
				<div class="default">
					<p class="icon-warning">
					<p class="comment"></p>
				</div>
			</li>
			<li class="cell search">
				<p class="title icon-title"></p>
				<p class="category"></p>
				<p class="address"></p>
			</li>
			<li class="cell chatRoom">
					<p class="title icon-chatting"></p>
					<p class="limit icon-participant"></p>
					<p class="address icon-title"></p>
					<div class="notification"></div>
			</li>
			<li class="cell bookmark">
				<p class="title"></p>
				<p class="address"></p>
			</li>
			<li class="person chatMember">
				<img class="profile" src="/images/person_icon.png"/>
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
	<input type="hidden" id="email" value="${sessionScope['member.email']}" />
	<input type="hidden" id="id" value="${sessionScope['member.id']}" />
	<div id="createChatRoom">
		<div class="outer bg"></div>
		<div class="centerArea">
			<div class="inner bg"></div>
			<div class="inputArea">
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
					<p>
						<input type="submit" value="Create Chatting Room" />
					</p>
				</form>
			</div>
		</div>
	</div>
	<!-- hidden Area (For Menu Control Box) -->
	<div style="display: none;">
		<div id="controlBox">
			<ul id='menu'>
				<a class='menu-button navigation'></a>
				<a class='menu-button hide-navigation'></a>
				<li class='menu-item icon-info' status='none'><a
					class='menu-item-back'></a></li>
				<li class='menu-item icon-bookmark' status='none'><a
					class='menu-item-back'></a></li>
				<li class='menu-item icon-chatting' status='none'><a
					class='menu-item-back'></a></li>
			</ul>
			<div class="menu-chatting content">
				<ol>
					<li class="chatRoom"><span class="icon-title">채팅방 테스트
							블라블라블라블라블라블라블라블라</span> <span class="icon-participant">3/10</span></li>
				</ol>
			</div>
			<div class="menu-info content"></div>
			<div class="menu-bookmark content"></div>
		</div>
	</div>

	<!-- hidden Area2 (For Entered Chatting Room List) -->
	<div style="display: none;">
		<p id="enteredChattingRoomList">${requestScope["enteredChattingRoomList"]}</p>
	</div>


	<!--페이지 전체를 감싸는 영역-->
	<div id="wrapper">

		<!--검색 박스와 로그아웃 버튼을 포함하는 헤더 영역-->
		<div id="header">
			<a id="logo" href="/main"><img src="/images/logo.png" /></a>

			<!--검색 박스와 검색 버튼을 포함하는 영역-->
			<div id="search_box">
				<input name=search_word type="text"></input>
				<button class="button" type="submit">검색</button>
			</div>
			<!-- 사용자 별명 -->
			<p id="user_name">${sessionScope["member.nickname_adjective"]}
				${sessionScope["member.nickname_noun"]}</p>

			<!--  로그아웃 버튼 -->
			<a id="logout_button" class="button" href="/logout">Logout</a>
		</div>

		<!--헤더를 제외하고 네비게이션바와 지도를 포함하는 핵심 컨텐츠 영역-->
		<div id="container">

			<div id="aside">
				<!--네비게이션바 영역 -->
				<div id="nav">
					<ul id="nav_list">
						<li class="on"><a href="#" class="search"></a></li>
						<li><a href="#" class="recommendation"></a></li>
						<li><a href="#" class="chatting"> </a>
							<div class="notification">0</div></li>
						<li><a href="#" class="bookmark"></a></li>
						<li><a href="#" class="settings"></a></li>
					</ul>
				</div>

				<!--네비게이션바를 눌렀을때 나오는 패널 영역-->
				<div id="panel">
					<div id="panel_contents">
						<!-- pc == panel_content -->
						<div id="pc_search" class="on">
							<ul>
								<div class="default">
									<p class="icon-warning">
									<p class="comment">상단의 검색버튼을 이용해주세요.</p>
								</div>
							</ul>
							
							<!-- 추후 여유가 될 때, 개발. scroll로 대체  
							<ul class="pcFooter">
								<li><i class="paging icon-left"></i></li>
								<li>1</li>
								<li>2</li>
								<li>3</li>
								<li><i class="paging icon-right"></i></li>
							</ul>
							-->

						</div>
						<div id="pc_recommendation">
							<div class="default">
								<p class="icon-warning">
								<p>추천 채팅방 리스트가 보여지는 창입니다.</p>
							</div>
						</div>
						<div id="pc_chatting">
							<ul>
							</ul>
						</div>
						<div id="pc_bookmark">
							<ul>
								<li class="cell bookmark">
									<p class="title icon-bookmark">우리집</p> <i class="icon-delete"></i>
									<p class="address">서울특별시 서초구 방배동 797-7 베로니스타운 지하 1층</p>
								</li>
							</ul>
							<ul class="pcFooter"></ul>
						</div>
						<div id="pc_settings">
							<div class="default">
								<p class="icon-warning">
								<p>설정창 입니다.</p>
							</div>
						</div>
					</div>
					<div id="panel_buttons">
						<a class="panel_button_fold" href="#"></a> <a
							class="panel_button_unfold" href="#"></a>
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
			<div id="content">
				<div id="map_area">
					<!-- 지도 영역 -->
					<div id="naver_map" class="naver_map"></div>
				</div>

				<!-- 채팅방 영역 -->
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

				<!-- 줌인/줌아웃 버튼 영역 -->
				<div id="zoomButton">
					<div id="zoomInButton"></div>
					<div id="zoomOutButton"></div>
				</div>
			</div>
		</div>
	</div>
</body>
<script type="text/javascript"
	src="http://127.0.0.1:3080/socket.io/socket.io.js"></script>
<script type="text/javascript" src="/javascripts/ajax.js?20140522"></script>
<script type="text/javascript" src="/javascripts/main.js?20140501"></script>
<script>
	window.onload = initialize();
</script>
<script type="text/javascript" src="/javascripts/search.js?20140521"></script>
</html>
