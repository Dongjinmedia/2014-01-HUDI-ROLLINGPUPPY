package com.puppy.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.util.Constants;

/*
 * 가입/로그인 페이지에서 GET방식으로 들어온 요청을 처리하는 컨트롤러
 * index.jsp로 request, response를 포워드해준다.
 */
public class HomeController implements Controller {
	
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		logger.info("into doGet");
		
		HttpSession session = request.getSession();
		
		// 세션 값이 있는 경우 main 페이지로 리다이렉트
		if ( session.getAttribute(Constants.SESSION_MEMBER_EMAIL) != null ) {
			response.sendRedirect("/main");
			return;
		}
		
		RequestDispatcher view = request.getRequestDispatcher("index.jsp");
		view.forward(request, response); 
		
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		
	}
}
