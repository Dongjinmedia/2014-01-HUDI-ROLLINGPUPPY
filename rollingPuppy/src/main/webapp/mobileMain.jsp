<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
	<title>Neighbor</title>
	<link rel="stylesheet" type="text/css" href="/stylesheets/reset.css">
	<link rel="stylesheet" type="text/css" href="/stylesheets/mobileMain.css">
</head>

<body>
	<!-- 검색창과 로고를 포함한 header -->
	<header>
		<div id="logo"><a href="/mobile"></a></div>
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
					<ul class="section">
						<li class="title"><h1>검색</h1></li>
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
				<div class="section_wrapper">
					<div class="section">
						<h1>채팅방</h1>
						<div class="card"></div>
						<div class="card"></div>
						<div class="card"></div>
					</div>
				</div>
				<div class="section_wrapper">
					<div class="section">
						<h1>관심장소</h1>
						<div class="card"></div>
						<div class="card"></div>
						<div class="card"></div>
					</div>
				</div>
				<div class="section_wrapper">
					<div class="section">
						<h1>설정</h1>
						<div class="card"></div>
						<div class="card"></div>
						<div class="card"></div>
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
	
	<script type="text/javascript" src="/javascripts/mobileMain.js"></script>
	<script type="text/javascript">
		window.onload = function() {
			oPanel.init();
			
			document.ontouchmove = function(event) {
				event.preventDefault();
			}
			
			var content = document.querySelector(".section");
			content.addEventListener('touchstart', function(event){
			    this.allowUp = (this.scrollTop > 0);
			    this.allowDown = (this.scrollTop < this.scrollHeight - this.clientHeight);
			    this.slideBeginY = event.pageY;
			});

			content.addEventListener('touchmove', function(event){
			    var up = (event.pageY > this.slideBeginY);
			    var down = (event.pageY < this.slideBeginY)
			    this.slideBeginY = event.pageY;
			    if ((up && this.allowUp) || (down && this.allowDown)) 
			        event.stopPropagation();
			    else
			        event.preventDefault();
			    });
		}
	</script>
</body>
</html>