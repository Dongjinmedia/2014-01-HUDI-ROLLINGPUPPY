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
import com.puppy.util.XMLReader;

public class SearchController implements Controller {

	private static final Logger logger = LoggerFactory.getLogger(SearchController.class);
	private static final String REQUEST_URL_FRONT = "http://openapi.naver.com/search?key=513cd098517cce82ec819f7862fb362f";
	private static final String REQUEST_URL_TAIL = "&target=local&start=1&display=10";
	private static final String SEARCH_EXPRESSION ="/rss/channel/item";

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.info("indo doGet of Search Controller");

		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
		Gson gson = new Gson();

		String searchKeyword = request.getParameter("searchKeyword");
		String requestURLString = REQUEST_URL_FRONT + "&query=" + searchKeyword + REQUEST_URL_TAIL;
		logger.info("requestURLString :" + requestURLString);
		URL requestURL = new URL(requestURLString);	
		XMLReader xmlReader = new XMLReader(requestURL);
		resultList = xmlReader.getListFromXPath(SEARCH_EXPRESSION);

		out.println(gson.toJson(resultList));
		logger.info(gson.toJson(resultList));
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}
}
