<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<%! 
	final String SESSION_NICKNAME_NOUN = "member.nickname_noun";
	final String SESSION_NICKNAME_ADJECTIVE = "member.nickname_adjective";
%>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Main Page</title>
	<link type="text/css" rel="stylesheet" href="/stylesheets/reset.css">
	<link type="text/css" rel="stylesheet" href="/stylesheets/main.css">
	<link type="text/css" rel="stylesheet" href="/stylesheets/map_menu.css">
	<script type="text/javascript" src="http://openapi.map.naver.com/openapi/naverMap.naver?ver=2.0&key=f154abb26c9c79ed5a4a25d000a9349c"></script>
</head>

<body>
<input type="hidden" id="nickname" value="<%=session.getAttribute(SESSION_NICKNAME_ADJECTIVE) + " " + session.getAttribute(SESSION_NICKNAME_NOUN)%>"/>
<div id="createChatRoom">
	<div class="outer bg"></div>
	<div class="centerArea">
		<div class="inner bg"></div>
		<div class="inputArea">
			<p class="createAddress">성남시 분당구 삼평동 H스퀘어 N동 4층 NHN NEXT</p>
			<form action="/room" method="post">
					<p>
						<label class="icon-chatting"></label>
						<input class="roomName" type="text" name="title" placeholder="Room name" />
					</p>
					<p>
						<label class="icon-people"></label>
						<input class="limitNum" type="number" name="max" placeholder="Limit Number" />
					</p>
					<p>
						<input type="submit" value="Create Chatting Room" />
					</p>
			</form>
		</div>
	</div>
</div>
<!-- hidden Area (For Menu Control Box) -->
<div style="display:none;">
	<div id="controlBox">
		<ul id='menu'> 
			<a class='menu-button navigation'></a> 
			<a class='menu-button hide-navigation'></a> 
			<li class='menu-item icon-info' status='none'>
				<a class='menu-item-back'></a>
			</li> 
			<li class='menu-item icon-bookmark' status='none'>
				<a class='menu-item-back'></a>
			</li> 
			<li class='menu-item icon-chatting' status='none'>
				<a class='menu-item-back'></a>
			</li> 
		</ul>
		<div class="menu-chatting content">
		</div>
		<div class="menu-info content">
		</div>
		<div class="menu-bookmark content">
		</div>
	</div>
</div>
<!--페이지 전체를 감싸는 영역-->
<div id="wrapper">

	<!--검색박스를 포함하는 헤더 영역-->
	<div id="header">
		<a id="logo" href="/main"><img src="/images/logo.png"/></a>
		
		<!--검색 박스와 검색 버튼을 포함하는 영역-->
		<div id="search_box">
			<input type="text"></input>
			<button class="button" type="submit">검색</button>
		</div>

		<a id="logout_button" class="button" href="/logout">Logout</a>
	</div>
	
	<!--헤더를 제외하고 네비게이션바와 지도를 포함하는 핵심 컨텐츠 영역-->
	<div id="container" class="no_panel">
	
		<div id="aside">
			<!--네비게이션바 영역 -->
			<div id="nav">
				<ul id="nav_list">
					<li><a href="#" class="search"></a></li>
					<li><a href="#" class="recommendation"></a></li>
					<li><a href="#" class="chatting"></a></li>
					<li><a href="#" class="bookmark"></a></li>
					<li><a href="#" class="settings"></a></li>
				</ul>
			</div>
			
			<!--네비게이션바를 눌렀을때 나오는 패널 영역-->
			<div id="panel">
				<a class="panel_button_fold" href="#"></a>
				<a class="panel_button_unfold" href="#"></a>
			</div>
		</div>
		
		<!-- 컨텐츠 영역에서 네비게이션과 패널 영역을 제외한, 지도를 포함한 영역-->
		<div id='mapClicker'>
			<div class='marker'></div>
			<div class='pulse'></div>
			<div class='clickerMenu'>
				<i class="clicker icon-add"></i>
				<i class="clicker icon-star"></i>
			</div>
		</div>
		<div id="content">
			<div id="map_area">
				<!-- 지도 영역 -->
				<div id="naver_map" class="naver_map"></div>
			</div>
			
			<!-- 줌인/줌아웃 버튼 영역 -->
			<div id="zoomButton">
				<div id="zoomInButton"></div>
				<div	 id="zoomOutButton"></div>
			</div>
		</div>
	</div>
	
</div>
</body>
<script type="text/javascript" src="http://127.0.0.1:3080/socket.io/socket.io.js"></script>
<script type="text/javascript" src="/javascripts/main.js"></script>
</html>
