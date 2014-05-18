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
		
		ServletContext servletContext = request.getServletContext();
		
		@SuppressWarnings("unchecked")
		Map<String, String> urlMappingObject = (Map<String, String>) servletContext.getAttribute("urlMappingObject");
		
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
		
		/*
		 * requestURL에 해당하는 Controller명을 저장하기 위한 변수
		 * 이 정보를 기준으로 controller를 reflection으로 실행한다.
		 */
		String controllerName = null;
		
		//possibleURL 리스트를 url-controller가 맵핑된 리스트와 비교한다.
		for (String url : possibleURL) {
			if ( urlMappingObject.containsKey(url) )
				controllerName = urlMappingObject.get(url);
		}
		
		//만약 해당하는 url값이 맵핑테이블에 없을경우 404 Error페이지를 노출한다.
		if ( controllerName == null ) {
			response.sendRedirect("/error?type=404");
			return;
		}
		
		//찾아낸 ClassName을 기반으로 Controller Class를 찾아낸후
		//객체를 생성한다.
		try {
			@SuppressWarnings("unchecked")
			Class<Controller> klass = (Class<Controller>) Class.forName( controllerName );
			controller = klass.newInstance();
			
		} catch (Exception e) {
			logger.error("ClassLoad", e);
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