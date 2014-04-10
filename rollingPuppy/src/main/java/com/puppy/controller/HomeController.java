package com.puppy.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/*
 * 가입/로그인 페이지에서 GET방식으로 들어온 요청을 처리하는 컨트롤러
 * index.jsp로 request, response를 포워드해준다.
 */
public class HomeController extends HttpServlet{
	
	private static final long serialVersionUID = -4541355416746302437L;
	private static final Logger log = LoggerFactory.getLogger(HomeController.class);
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		log.info("HomeController doPost");
		
		RequestDispatcher view = request.getRequestDispatcher("index.jsp");
		view.forward(request, response); 
		
	}
}