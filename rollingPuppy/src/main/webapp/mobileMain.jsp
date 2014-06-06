<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
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
	<div id="template" class="hidden" style="display: none;">
		<ul>
			<li class="card none">
				<div class="default">
					<p class="icon-warning">
					<p class="comment"></p>
				</div>
			</li>
			
			<li class="card search">
				<p class="title icon-title"></p>
				<p class="category"></p>
				<p class="address"></p>
			</li>
			
			<li class="card chatRoom">
				<p class="title icon-chatting"></p>
				<p class="limit icon-participant"></p>
				<p class="address icon-title"></p>
				<div class="notification"></div>
			</li>
		</ul>
	</div>

	<!-- 검색창과 로고를 포함한 header -->
	<header>
	<div id="logo">
		<a href="/mobile"></a>
	</div>
	<!-- sf = searchForm  -->
	<div id="sf_wrapper">
		<form id="sf" name="search">
			<!-- sb = searchBox(검색창) -->
			<div id="sb_wrapper">
				<div id="sb_positioner">
					<input type="text">
				</div>
			</div>
			<input type="submit" value="검색">
		</form>
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
									<p class="address">서울특별시 중구 명동 2가 52-8 은좌빌팅 1,2층여기거기여가거가 우리우</p>
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
							<ul class="section">
								<li class="title"><h1>채팅방</h1></li>
								<li class="card"></li>
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
							<ul class="section">
								<li class="title"><h1>관심장소</h1></li>
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
					<div id="scroll3" class="scroll_wrapper">
						<div class="scroll_area">
							<ul class="section">
								<li class="title"><h1>설정</h1></li>
								<li class="card"></li>
								<li class="card"></li>
								<li class="card"></li>
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

	<footer></footer> <script type="text/javascript"
		src="/javascripts/mobileMain.js"></script> <script
		type="text/javascript" src="/javascripts/iscroll.js"></script> <script
		type="text/javascript" style="display: none;">
			window.onload = function() {
				document.addEventListener("touchmove", function(event) {
					event.preventDefault();
				});

				oScrolls.init();
				oPanel.init();
			}
		</script>
</body>
</html>
