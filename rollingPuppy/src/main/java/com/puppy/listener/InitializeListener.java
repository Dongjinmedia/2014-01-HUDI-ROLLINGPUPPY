package com.puppy.listener;

import java.io.File;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class InitializeListener implements ServletContextListener{

	private static final Logger logger = LoggerFactory.getLogger(InitializeListener.class);
	
	@Override
	public void contextInitialized(ServletContextEvent servletContextEvent) {
		logger.info("into contextInitialized");
		
		String xmlPath = servletContextEvent.getServletContext().getInitParameter("requestUrlMappingXml");
		logger.info(xmlPath);
		
		//참조 : http://stackoverflow.com/questions/13967307/reading-from-src-main-resources-gives-nullpointerexception
		logger.info("exists : "+this.getClass().getClassLoader().getResource("url.xml"));
	}

	@Override
	public void contextDestroyed(ServletContextEvent servletContextEvent) {
		
	}

}
