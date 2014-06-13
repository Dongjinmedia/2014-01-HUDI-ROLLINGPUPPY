package com.puppy.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.puppy.util.Constants;
import com.puppy.util.ServletSessionUtils;

/*
 * 가입/로그인 페이지에서 GET방식으로 들어온 요청을 처리하는 컨트롤러
 * index.jsp로 request, response를 포워드해준다.
 */
public class HomeController implements Controller {
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		// 세션 값이 있는 경우 main 페이지로 리다이렉트
		if ( ServletSessionUtils.getStringParameter(request, Constants.SESSION_MEMBER_EMAIL) != null ) {
			response.sendRedirect("/main");
			return;
		}
		
		RequestDispatcher view = request.getRequestDispatcher("index.jsp");
		view.forward(request, response); 
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {}
}
