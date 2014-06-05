package com.puppy.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.util.Method;
import com.puppy.util.Util;

/*
 * 채팅방에 대한 요청들을 처리할 컨트롤러.
 * URL을 분석해서 해당하는 메소드를 실행하도록 만들어져있다.
 * 
 * @MultipartConfig는 자바스크립트에서 Ajax요청시, formData를 전달할 수 있도록 하기 위해서 선언하였다.
 * Servlet에서 formData(정확히 이야기해서 MultipartRequest)를 처리하기 위해서는 선언되어야 하는 어노테이션이며,
 * 전달하는 FormData를 Servlet에서는 multipart로 인식한다. 아래의 링크를 확인해보자.
 * http://stackoverflow.com/questions/10292382/html-5-formdata-and-java-servlets
 * 
 * Part클래스에 대한 설명은 다음과 같다
 *  	This class represents a part or form item that was received within a
 * 		multipart/form-data POST request.
 */
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
		
		/*
		 * MultiPart는 Post방식일 경우에만 동작한다. 그러므로 doPost 메소드 안에서 처리한다.
		 * 
		 * 일반적으로 사용하는 Parameter처럼
		 * 간단하게 사용할 수 있도록 request객체에 setAttribute해준다. 
		 */
		try {
			for (Part part: request.getParts()) {
				request.setAttribute(part.getName(), Util.getStringValueFromPart(part));
				logger.info("part.getName : "+part.getName());
				logger.info("part value : "+ Util.getStringValueFromPart(part));
			}
		} catch (Exception e) {
			logger.error("error occur : ", e);
		}
		
		requestAnaliyzer(request, response);
	}
	
	protected void requestAnaliyzer(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		ServletContext servletContext = request.getServletContext();
		
		@SuppressWarnings("unchecked")
		Map<String, Controller> urlMappingObject = (Map<String, Controller>) servletContext.getAttribute("urlMappingObject");
		
		Method method = null; 
		//ModelAndView modelAndView = null;
		Controller controller = null;
		
		String requestUrl = request.getRequestURI();
		String requestMethod = request.getMethod();
		
		logger.info("method : "+requestMethod);
		logger.info("url : "+requestUrl);
		
		if ( requestMethod.equalsIgnoreCase("POST")) {
			method = Method.POST;
		} else if ( requestMethod.equalsIgnoreCase("GET")) {
			method = Method.GET;
		} else {
			response.sendRedirect("/error?type=500");
		}
		
		
		/*
		 * wildcard(*) 설정에 대해 대응하기 위한 소스코드
		 * uriPaths는 요청되는 url을 "/"를 단위로 잘라서 배열로 저장한다.
		 * 
		 * possibleURL은 요청된 url을 조작하여 *를 가지는 url값으로 변경한뒤,
		 * list에 담아놓는 그릇이다. 예를들어 /a/b/c라는 요청 url에 대해 /a/b/c, /a/b/*, /a/* 에 대한 모든경우로 url을 분리한뒤,
		 * 비교하기 위해 사용된다. 
		 * 
		 * tempPath는 요청 url을 다루기위한 임시변수이다.
		 */
		String uriPaths[] = requestUrl.split("/"); 
		String tempPath = requestUrl;
		
 
		//1. url 혹은 2.url/ 에 대한 요청 모두를 처리할 수 있도록 마지막 char값을 확인한다. 
		if (tempPath.endsWith("/"))
			tempPath = tempPath.substring(0, tempPath.length()-1);
		
		ArrayList<String> possibleURL = new ArrayList<String>();
		possibleURL.add(tempPath);
		
		/*
		 * uriPaths배열의 갯수-1 만큼을 수행하며 possibleURL을 채운다.
		 * 루트Path는 필요없기 때문에 0이 아니라 1까지 체크하는 것이다.
		 */
		for (int index = uriPaths.length-1 ; index > 1 ; --index) {
			tempPath = replaceLast(tempPath, uriPaths[index], "");
			possibleURL.add(tempPath+"*");
			tempPath = tempPath.substring(0, tempPath.length()-1);
		}
		
		//possibleURL 리스트를 url-controller가 맵핑된 리스트와 비교한다.
		for (String url : possibleURL) {
			if ( urlMappingObject.containsKey(url) ) {
				controller = urlMappingObject.get(url);
				break;
			}
		}
		
		if ( controller != null )
			passController(request, response, method, controller);
		//알 수 없는 오류발생
		else
			response.sendRedirect("/error?type=500");
	}
	
	public void passController(HttpServletRequest request, HttpServletResponse response, Method method, Controller controller) throws ServletException, IOException {
		if ( method == Method.POST )
			controller.doPost(request, response);
		else if ( method == Method.GET )
			controller.doGet(request, response);
	}
	
	public String replaceLast(String text, String regex, String replacement) {
        return text.replaceFirst("(?s)(.*)" + regex, "$1" + replacement);
    }
}