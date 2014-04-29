package com.puppy.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/*
 * 로그아웃 요청에 대한 컨트롤러
 */
@SuppressWarnings("serial")
public class LogoutController extends HttpServlet {

	private static final Logger logger = LoggerFactory.getLogger(LogoutController.class);
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		logger.info("into doGet");
		
		HttpSession session = request.getSession();
		
		// 세션을 없애면 로그아웃이 됩니다.
		session.invalidate();
		response.sendRedirect("/");
	}
}
