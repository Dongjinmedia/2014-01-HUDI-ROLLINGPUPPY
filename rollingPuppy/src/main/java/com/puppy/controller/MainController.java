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
 * 로그인 이후 사용자가 머무는 유일한 페이지
 */
@SuppressWarnings("serial")
public class MainController extends HttpServlet {
	
	private static final Logger log = LoggerFactory.getLogger(MainController.class);
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		log.info("into doPost");
		
		RequestDispatcher view = request.getRequestDispatcher("main.jsp");
		view.forward(request, response); 
	}
}