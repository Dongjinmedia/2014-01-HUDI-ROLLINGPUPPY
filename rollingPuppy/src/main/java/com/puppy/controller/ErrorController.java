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
		
	private static final Logger logger = LoggerFactory.getLogger(ErrorController.class);
	
	//RequestDispatch 할 파일이름
	private final String ERROR404_JSPFILE_NAME = "error404.jsp";
	private final String ERROR500_JSPFILE_NAME = "error500.jsp";
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		//요청에 대한 statusCode를 반환
		Object statusCodeObject = request.getAttribute("javax.servlet.error.status_code");
		
		//어떤 url요청을 통한 에러발생인지
		Object requestUrlObject = request.getAttribute("javax.servlet.error.request_uri");
		
		//Error에 대한 데이터를 담고있는 exception객체를 가져온다. 
		Object exceptionObject = request.getAttribute("javax.servlet.error.exception");
		
		//get url Parameter로 전달된 type 데이터를 가져온다. (자세한 내용은 web.xml  error-page에 대한 정의 확인)
		//404에러발생시 /error?type=404 로 요청을 하기때문에 getParameter가 자동으로 붙는다.
		String errorType = request.getParameter("type");
		
		//각각의 Object가 null인지를 체크해서 값을 출력하고 있다.
		//만약 null일경우 캐스팅을 하면 에러가 발생하기 때문
		if ( statusCodeObject != null ) {
			logger.error("[[ERROR CODE]]");
			logger.error((Integer)statusCodeObject+"\n\n");
		}
		
		if ( requestUrlObject != null ) {
			logger.error("[[REQUEST URL]]");
			logger.error( (String)requestUrlObject+"\n\n"); 
		}
		
		if ( exceptionObject != null ) {
			Throwable throwable = (Throwable) exceptionObject;
			if ( throwable != null ) {
				logger.error("[[THROWABLE MESSAGE]]");
				logger.error(throwable.getMessage()+"\n\n");
			}
		}
		
		int errorCode = 404;
		String errorPage = ERROR404_JSPFILE_NAME;
		
		try {
			errorCode = Integer.parseInt(errorType);
		} catch (Exception e) {
			logger.error("ParseError", e);
		}
			
		if ( errorCode == 500 ) {
			errorPage = ERROR500_JSPFILE_NAME;
		}
		
		RequestDispatcher view = request.getRequestDispatcher(errorPage);
		view.forward(request, response); 
		
	}
}