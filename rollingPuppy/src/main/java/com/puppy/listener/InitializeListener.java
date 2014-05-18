package com.puppy.listener;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.util.XMLReader;

/*
 * FrontController에서 사용할 URLMapping데이터를 처리하기 위한 Listener Class이다.
 * 
 * URL과 Controller매핑은 src/main/resources/url.xml에 정의되어 있으며,
 * 이 클래스에서는 Tomcat이 프로젝트를 구동하는 처음에
 * url.xml의 데이터를 읽어서 메모리에 적재하는 역할을 하고 있다.
 */
public class InitializeListener implements ServletContextListener{

	private static final Logger logger = LoggerFactory.getLogger(InitializeListener.class);
	
	@Override
	public void contextInitialized(ServletContextEvent servletContextEvent) {
		logger.info("into contextInitialized");
		
		ServletContext servletContext = servletContextEvent.getServletContext();
		
		
		//XML에 정의된 context-param데이터를 가져온다.
		String xmlPath = servletContext.getInitParameter("UrlToControllerMappingXmlFileName");
		
		//참조 : http://stackoverflow.com/questions/13967307/reading-from-src-main-resources-gives-nullpointerexception
		InputStream urlXmlStream = this.getClass().getClassLoader().getResourceAsStream(xmlPath);
		
		//Util 패키지에 생성된 XMLReader 클래스 객체 생성
		XMLReader xmlReader = new XMLReader(urlXmlStream);
		String expression = "/mappings/mapping";
		List<Map<String, Object>> urlMappingList = xmlReader.getListFromXPath(expression);
		
		//TODO 테스트코드 삭제
		//for (Map<String, Object> map : urlMappingList) {
		//	logger.info("===============================");
		//	logger.info( "URL: "+ map.get("url"));
		//	logger.info( "CONTROLLER: "+ map.get("controller"));
		//}
		
		//메모리(Context)에 저장할 URL Mapping 객체
		Map<String, String> urlMappingObject = new HashMap<String, String>();
		
		/*
		 * 현재 list형태로 이루어져 있는 url mapping 데이터를 map으로 이루어진 key, value형태로 변경한다.
		 * 
		 * ex)
		 * urlMappingList는 다음과 같이 생겼다.
		 * [{'url': '/test1', 'controller': 'test1Controller'}, {'url: '/test2', 'controller': 'test2Controller'}... ]
		 * 
		 * 변경하고자 하는 urlMappingObject는 다음과 같이 생겼다.
		 * {'/test1': 'test1Controller', '/test2': 'test2Controller'...}
		 * 
		 * 그렇다면 왜 이렇게 만드는 것일까?
		 * list형태로 담겨있을 경우, 검색이 어렵다.
		 * 어떤 url매핑이 요청되었을 경우,
		 * 해당 url을 찾기 위해서는 모든 list를 순회하면서 찾아봐야 하기 때문이다.
		 * 
		 * 하지만 key, value형태에서 key값이 url과 일치한다면 검색의 cost가 현져하게 낮아지기 때문이다. 
		 */
		for (Map<String, Object> map : urlMappingList) {
			urlMappingObject.put(map.get("url").toString(), map.get("controller").toString() );
		}
		
		servletContext.setAttribute("urlMappingObject", urlMappingObject);
		
	}

	@Override
	public void contextDestroyed(ServletContextEvent servletContextEvent) {
		
	}

}
