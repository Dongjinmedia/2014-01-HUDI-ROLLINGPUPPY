<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
	<title>Neighbor</title>
	<link rel="stylesheet" type="text/stylesheet" href="/stylesheets/reset.css">
	<link rel="stylesheet" type="text/stylesheet" href="/stylesheets/mobileMain.css">
</head>

<!-- Custom tag는 IE에서 정상적으로 동작하지 않는다 -->
<!-- IE는 Custom tag를 하나하나 등록시켜줘야 한다 -->
<body>
	<header>
		<logo><a href="/mobile"></a></logo>
		<searchBox>
			<form name="search">
				<inputTextWrapper>
					<inputTextPositioner>
						<input type="text">
					</inputTextPositioner>
				</inputTextWrapper>
				<input type="submit" value="검색">
			</form>
		</searchBox>
	</header>
	<navigation>
		<account></account>
		<menu>
			<search class="on">
				<a href="#">검색</a>
			</search>
			<chatting>
				<a href="#">채팅방</a>
			</chatting>
			<bookmark>
				<a href="#">관심장소</a>
			</bookmark>
			<setting>
				<a href="#">설정</a>
			</setting>
		</menu>
	</navigation>
	<panelWrapper>
		<panel>
			<contents>
				<section>
					<sectionContents>
						<h1>검색</h1>
						<card></card>
						<card></card>
						<card></card>
						<card></card>
						<card></card>
						<card></card>
						<card></card>
						<card></card>
						<card></card>
					</sectionContents>
				</section>
				<section>
					<sectionContents>
						<h1>채팅방</h1>
						<card></card>
						<card></card>
						<card></card>
					</sectionContents>
				</section>
				<section>
					<sectionContents>
						<h1>관심장소</h1>
						<card></card>
						<card></card>
						<card></card>
					</sectionContents>
				</section>
				<section>
					<sectionContents>
						<h1>설정</h1>
						<card></card>
						<card></card>
						<card></card>
					</sectionContents>
				</section>
			</contents>
			<panelButtons>
				<fold><div class="panelFold" href="#"></div></fold>
				<unfold><div class="panelUnfold" href="#"></div></unfold>
			</panelButtons>
		</panel>
	</panelWrapper>

	<map></map>

	<footer></footer>	
	<script type="text/javascript" src="/javascripts/mobileMain.js"></script>
	<script type="text/javascript" style="display:none">
		window.onload = function() {
			oPanel.init();
			document.ontouchmove = function(event) {
				event.preventDefault();
			} 
		}
	</script>
</body>
</html>