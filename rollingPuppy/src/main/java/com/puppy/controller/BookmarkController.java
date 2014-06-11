package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.puppy.dao.impl.BookmarkDaoImpl;
import com.puppy.dto.Bookmark;
import com.puppy.util.Constants;
import com.puppy.util.ServletRequestUtils;
import com.puppy.util.ServletSessionUtils;
import com.puppy.util.ThreeWayResult;

public class BookmarkController implements Controller {
	
	private static final Logger logger = LoggerFactory.getLogger(BookmarkController.class);
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String requestURL = request.getRequestURI().toLowerCase();
		logger.info("requestURL : "+ requestURL);
		
		if ( requestURL.contains("add") ) {
			addBookmark(request, response);
		} else if (requestURL.contains("delete")) {
			deleteBookmark(request, response);
		}
	}

	private void deleteBookmark(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		Map<String, Object> returnData = new HashMap<String, Object>();
		Gson gson = new Gson();
		boolean isSuccess = false;
		
		BookmarkDaoImpl bookmarkDao = BookmarkDaoImpl.getInstance();
		int successQueryNumber = 0;
		
		int bookmarkId = ServletRequestUtils.getIntParameterFromPart(request, Constants.REQUEST_BOOKMARK_ID);
		int userId = ServletSessionUtils.getIntParameter(request, Constants.SESSION_MEMBER_ID);
		
		Bookmark bookmark = new Bookmark();
		bookmark.setId(bookmarkId);
		bookmark.setMemberId(userId);
		
		successQueryNumber = bookmarkDao.deleteBookmark(bookmark);
		
		if ( successQueryNumber >= 1 ) {
			isSuccess = true;
		}
		
		returnData.put(Constants.JSON_RESPONSE_ISSUCCESS, isSuccess);
		out.println(gson.toJson(returnData));
	}

	private void addBookmark(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		Map<String, Object> returnData = new HashMap<String, Object>();
		ThreeWayResult result = ThreeWayResult.FAIL;
		BookmarkDaoImpl bookmarkDao = BookmarkDaoImpl.getInstance();
		int successQueryNumber = 0;
		
		String bookmarkName = ServletRequestUtils.getStringParameterFromPart(request, Constants.REQUEST_BOOKMARK_NAME);
		String locationName = ServletRequestUtils.getStringParameterFromPart(request, Constants.REQUEST_LOCATION_NAME);
		BigDecimal latitude = ServletRequestUtils.getBigDecimalParameterFromPart(request, Constants.REQUEST_LOCATION_LATITUDE);
		BigDecimal longitude = ServletRequestUtils.getBigDecimalParameterFromPart(request, Constants.REQUEST_LOCATION_LONGITUDE);
		int memberId = ServletSessionUtils.getIntParameter(request, Constants.SESSION_MEMBER_ID);
		
		Bookmark bookmark = new Bookmark();
		bookmark.setMemberId(memberId);
		bookmark.setLocationName(locationName);
		bookmark.setBookmarkName(bookmarkName);
		bookmark.setLocationLatitude(latitude);
		bookmark.setLocationLongitude(longitude);
		
		successQueryNumber = bookmarkDao.insertBookmark(bookmark);
		
		if ( successQueryNumber >= 1 ) {
			result = ThreeWayResult.SUCCESS;
		}
		
		returnData.put(Constants.JSON_RESPONSE_ISSUCCESS, result);
		returnData.put(Constants.JSON_RESPONSE_BOOKMARK, bookmark);
		
		out.println(gson.toJson(returnData));
	}
}
