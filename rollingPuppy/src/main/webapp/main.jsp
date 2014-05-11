<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" isELIgnored="false" %>
<!DOCTYPE html>
<html>
<%! 
	final String SESSION_NICKNAME_NOUN = "member.nickname_noun";
	final String SESSION_NICKNAME_ADJECTIVE = "member.nickname_adjective";
%>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Main Page</title>
	<link type="text/css" rel="stylesheet" href="/stylesheets/reset.css?20140501">
	<link type="text/css" rel="stylesheet" href="/stylesheets/main.css?20140504">
	<script type="text/javascript" src="http://openapi.map.naver.com/openapi/naverMap.naver?ver=2.0&key=f154abb26c9c79ed5a4a25d000a9349c"></script> 
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
	
	<!-- Test Unit -->
	<link rel="stylesheet" href="/UnitTest/lib/qunit-1.14.0.css">
	<style>
		#TestUnitArea.on {
			display: 	block;
		}
		#TestUnitArea.off {
			display: none;
		}
	</style>
</head>

<body>
<!-- Test Unit -->
<div id="TestUnitArea" class="off">
	<div id="qunit"></div>
	<div id="qunit-fixture"></div>
</div>
<div id="template" class="hidden" style="display:none;">
	<ul class>
		<li class="cell chatRoom"></li>
		<li class="cell search">
			<i class="clicker icon-star"></i>
			<p class="title">갈빗집</p>
			<p class="category">한식 > 소고기구이</p>
			<p class="address">서울특별시 서초구 방배동 797-7 베로니스타운 지하 1층</p>
		</li>
		<li class="cell bookmark">
		  	<p class="title">우리집</p>
		  	<p class="address">서울특별시 서초구 방배동 797-7 베로니스타운 지하 1층</p>
		</li>
	</ul>
</div>
<input type="hidden" id="email" value="${sessionScope['member.email']}"/>
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
			<ol>
				<li class="chatRoom">
					<span class="icon-title">채팅방 테스트 블라블라블라블라블라블라블라블라</span>
					<span class="icon-participant">3/10</span>
				</li>
			</ol>
		</div>
		<div class="menu-info content">
		</div>
		<div class="menu-bookmark content">
		</div>
	</div>
</div>
<!--페이지 전체를 감싸는 영역-->
<div id="wrapper">

	<!--검색 박스와 로그아웃 버튼을 포함하는 헤더 영역-->
	<div id="header">
		<a id="logo" href="/main"><img src="/images/logo.png"/></a>
		
		<!--검색 박스와 검색 버튼을 포함하는 영역-->
		<div id="search_box">
			<input name=search_word type="text"></input>
			<button class="button" type="submit">검색</button>
		</div>
		<!-- 사용자 별명 -->
		<p id="user_name">${sessionScope["member.nickname_adjective"]} ${sessionScope["member.nickname_noun"]}</p>

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
					<li>
						<a href="#" class="chatting">
						</a>
							<div class="notification">0</div>
					</li>
					<li><a href="#" class="bookmark"></a></li>
					<li><a href="#" class="settings"></a></li>
				</ul>
			</div>
			
			<!--네비게이션바를 눌렀을때 나오는 패널 영역-->
			<div id="panel">
				<div id="panel_contents">
					<!-- pc == panel_content -->
					<div id="pc_search" class="on">
						<p>검색 결과가 나오는 창입니다.</p>
						<ul>
							<li class="cell search">
								<p class="title icon-title">갈빗집</p>
								<p class="category">한식 > 소고기구이</p>
								<p class="address">서울특별시 서초구 방배동 797-7 베로니스타운 지하 1층</p>
							</li>
						</ul>
							<ul class ="pcFooter">
								<li><i class="paging icon-left"></i></li>
								<li>1</li>
								<li>2</li>
								<li>3</li>
								<li><i class="paging icon-right"></i></li>
							</ul>
						
					</div>
					<div id="pc_recommendation">추천 채팅방 리스크가 보여지는 창입니다.</div>
					<div id="pc_chatting">
						<p>내가 속한 채팅방 목록이 보여지는 창입니다.</p>
						<ul>
							<li class="cell chatting">
								<p class="title icon-chatting">모여라 꿈동산 여기는 판교판교</p>
								<p class="limit icon-participant">1 / 300</p>
								<p class="address icon-title">삼평동 H스퀘어 N동 4층 NHN NEXT</p>
								<div class="notification">0</div>
							</li>
						</ul>
					</div>
					<div id="pc_bookmark">관심장소로 지정한 지역을 보여주는 창입니다.
						<ul>
							<li class="cell bookmark">
							  	<p class="title icon-bookmark">우리집</p>
							  	<i class="icon-delete"></i>
							  	<p class="address">서울특별시 서초구 방배동 797-7 베로니스타운 지하 1층</p>
							</li>
						</ul>
						<ul class ="pcFooter"></ul>
					</div>
					<div id="pc_settings">설정창 입니다.</div>
				</div>
				<div id="panel_buttons">
					<a class="panel_button_fold" href="#"></a>
					<a class="panel_button_unfold" href="#"></a>
				</div>
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
<script type="text/javascript" src="/javascripts/main.js?20140501"></script>

<!-- Test Unit -->
<script src="/UnitTest/lib/qunit-1.14.0.js"></script>
<script src="/UnitTest/main.test.js"></script>

</html>