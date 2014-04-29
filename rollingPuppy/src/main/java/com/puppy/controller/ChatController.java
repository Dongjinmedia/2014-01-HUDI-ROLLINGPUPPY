package com.puppy.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/*
 * 채팅방에 대한 요청들을 처리할 컨트롤러.
 * URL을 분석해서 해당하는 메소드를 실행하도록 만들어져있다.
 * TODO FrontController Pattern으로 확장
 */
@SuppressWarnings("serial")

//For getParameter From Javascript new FormData (Ajax Request)
@MultipartConfig
public class ChatController extends HttpServlet {
	
	private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		//TODO Delete Log into doGet
		logger.info("into doGet");
	}
	
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		//TODO Delete Log into doPost
		logger.info("into doPost");
		
		String requestURL = request.getRequestURI().toLowerCase();
		
		logger.info("requestURL : "+ requestURL);
		
		if ( requestURL.contains("create") )
			createChattingRoom(request, response);
		//} else if ( requestURL.contains("") )
	}
	
	//logger.info(request.getParameter("test1")); null 값을 반환한다.
	//전달하는 FormData를 Servlet에서는 multipart로 인식한다. 아래의 링크를 확인해보자.
	//http://stackoverflow.com/questions/10292382/html-5-formdata-and-java-servlets
	public void createChattingRoom(HttpServletRequest request, HttpServletResponse response) {
		String value1 =  null;
		String value2 = null;
		String value3 = null;
		
		try {
			value1 = getValue(request.getPart("test1"));
			value2 = getValue(request.getPart("test2"));
			value3 = getValue(request.getPart("test3"));
		} catch (Exception e) {
			logger.error("getParameterFrom Javascript FormData",e);
		}
		
		logger.info(value1);
		logger.info(value2);
		logger.info(value3);
	}
	
	//getParameterValue From Javascript FormData
	private static String getValue(Part part) throws IOException {
	    BufferedReader reader = new BufferedReader(new InputStreamReader(part.getInputStream(), "UTF-8"));
	    StringBuilder value = new StringBuilder();
	    char[] buffer = new char[1024];
	    for (int length = 0; (length = reader.read(buffer)) > 0;) {
	        value.append(buffer, 0, length);
	    }
	    return value.toString();
	}
}
