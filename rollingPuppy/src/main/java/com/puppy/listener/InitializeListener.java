package com.puppy.listener;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.util.XMLReader;


public class InitializeListener implements ServletContextListener{

	private static final Logger logger = LoggerFactory.getLogger(InitializeListener.class);
	
	@Override
	public void contextInitialized(ServletContextEvent servletContextEvent) {
		logger.info("into contextInitialized");
		
		//XML에 정의된 context-param데이터를 가져온다.
		String xmlPath = servletContextEvent.getServletContext().getInitParameter("UrlToControllerMappingXmlFileName");
		
		//참조 : http://stackoverflow.com/questions/13967307/reading-from-src-main-resources-gives-nullpointerexception
		InputStream urlXmlStream = this.getClass().getClassLoader().getResourceAsStream(xmlPath);
		
		//Util 패키지에 생성된 XMLReader 클래스 객체 생성
		XMLReader xmlReader = new XMLReader(urlXmlStream);
		
		String expression = "/mappings/mapping";
		List<Map<String, Object>> urlMappingList = xmlReader.getListFromXPath(expression);
		
		for (Map<String, Object> map : urlMappingList) {
			logger.info("===============================");
			logger.info( "URL: "+ map.get("url"));
			logger.info( "CONTROLLER: "+ map.get("controller"));
		}
	}

	@Override
	public void contextDestroyed(ServletContextEvent servletContextEvent) {
		
	}

}
