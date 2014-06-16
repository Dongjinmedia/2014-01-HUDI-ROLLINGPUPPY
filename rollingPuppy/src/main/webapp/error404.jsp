<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<title></title>
<link rel="stylesheet" type="text/css" media="screen" href="/stylesheets/error/bootstrap.min.css">
<link rel="stylesheet" type="text/css" media="screen" href="/stylesheets/error/error.min.css">
<link rel="stylesheet" type="text/css" media="screen" href="/stylesheets/error/error404.css">
</head>
<body>
	<div id="content">
		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<div class="row">
					<div class="col-sm-12">
						<div class="text-center error-box">
							<h1 class="error-text-2 bounceInDown animated">
								Error 404<span class="particle particle--c"></span><span
									class="particle particle--a"></span><span
									class="particle particle--b"></span>
							</h1>
							<h2 class="font-xl">
								<strong>Page Not Found</strong>
							</h2>
							<br>
							<p class="lead">주소가 잘못되었습니다. 메인페이지로 이동합니다.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
<script>
	setTimeout(function() {
		location.href ="/";
	}, 3000);
</script>
</html>