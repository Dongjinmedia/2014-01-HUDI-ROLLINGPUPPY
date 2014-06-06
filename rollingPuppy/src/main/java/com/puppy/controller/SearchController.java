package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.puppy.util.Constants;
import com.puppy.util.ServletRequestUtils;
import com.puppy.util.XMLReader;

public class SearchController implements Controller {

	private static final Logger logger = LoggerFactory.getLogger(SearchController.class);
	private static final String REQUEST_URL_FRONT = "http://openapi.naver.com/search?key=513cd098517cce82ec819f7862fb362f";
	private static final String REQUEST_URL_TAIL = "&target=local&start=1&display=20";
	private static final String SEARCH_EXPRESSION ="/rss/channel/item";

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		List<Map<String, String>> resultList = new ArrayList<Map<String, String>>();
		Gson gson = new Gson();
		
		String searchKeyword = ServletRequestUtils.getParameter(request, Constants.REQUEST_SEARCH_QUERY);
		
		if ( searchKeyword == null ) {
			out.println(gson.toJson(null));
		} else {
			String requestURLString = REQUEST_URL_FRONT + "&query=" + searchKeyword + REQUEST_URL_TAIL;
			logger.info("searchKeyword : " + searchKeyword);
			
			URL requestURL = new URL(requestURLString);	
			XMLReader xmlReader = new XMLReader(requestURL);
			resultList = xmlReader.getListFromXPath(SEARCH_EXPRESSION);
			logger.info(gson.toJson(resultList));
			out.println(gson.toJson(resultList));
		}
	}
}
