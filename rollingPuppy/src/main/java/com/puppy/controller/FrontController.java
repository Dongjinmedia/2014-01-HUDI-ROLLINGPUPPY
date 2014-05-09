package com.puppy.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.util.Method;

@SuppressWarnings("serial")
@MultipartConfig
public class FrontController extends HttpServlet {

	private static final Logger logger = LoggerFactory.getLogger(FrontController.class);
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		requestAnaliyzer(request, response);
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		requestAnaliyzer(request, response);
	}
	
	protected void requestAnaliyzer(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Method method = null; 
		//ModelAndView modelAndView = null;
		Controller controller = null;
		
		String requestUrl = request.getRequestURI();
		String requestMethod = request.getMethod();
		
		if ( requestMethod.equalsIgnoreCase("POST")) {
			method = Method.POST;
		} else if ( requestMethod.equalsIgnoreCase("GET")) {
			method = Method.GET;
		} else {
			//throw Exception
		}
		
		logger.info("method : "+requestMethod);
		logger.info("url : "+requestUrl);
		
		if ( requestUrl.contains("/index") ) {
			controller = new HomeController();
			
		} else if ( requestUrl.contains("/join") ) {
			controller = new JoinController();
			
		} else if ( requestUrl.contains("/login") ) {
			controller = new LoginController();
			
		} else if ( requestUrl.contains("/logout") ) {
			controller = new LogoutController();
			
		} else if ( requestUrl.contains("/main") ) {
			controller = new MainController();
			
		} else if ( requestUrl.contains("/error") ) {
			controller = new ErrorController();
			
		} else if ( requestUrl.contains("/chat/") ) {
			controller = new ChatController();
			
		} else if ( requestUrl.contains("/search") ) {
			controller = new SearchController();
			
		} else if ( requestUrl.contains("/getId") ) {
			controller = new ChattingServerLinkController();
		} else {
			//throw exception
		}
		
		if ( controller != null )
			passController(request, response, method, controller);
	}
	
	public void passController(HttpServletRequest request, HttpServletResponse response, Method method, Controller controller) throws ServletException, IOException {
		if ( method == Method.POST )
			controller.doPost(request, response);
		else if ( method == Method.GET )
			controller.doGet(request, response);
	}
	
}