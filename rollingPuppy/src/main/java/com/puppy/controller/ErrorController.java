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
 * 404, 500 Error 발생시 자동으로 호출되는 Controller
 */
@SuppressWarnings("serial")
public class ErrorController extends HttpServlet{
		
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		logger.info("into doGet");
		
		RequestDispatcher view = request.getRequestDispatcher("error404.jsp");
		view.forward(request, response); 
		
	}
}