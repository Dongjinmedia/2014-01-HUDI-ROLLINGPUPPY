package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.util.Constants;

@SuppressWarnings("serial")
public class ChattingServerLinkController extends HttpServlet{
	
	private static final Logger logger = LoggerFactory.getLogger(ChattingServerLinkController.class);
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		String requestURL = request.getRequestURI().toLowerCase();
		logger.info("requestURL : "+ requestURL);
		
		response.setContentType("application/json");

		PrintWriter out = response.getWriter();
		HttpSession session = request.getSession();
		
		logger.info(""+session.getAttribute(Constants.SESSION_MEMBER_EMAIL));
		out.println(session.getAttribute(Constants.SESSION_MEMBER_EMAIL));
	}
}
