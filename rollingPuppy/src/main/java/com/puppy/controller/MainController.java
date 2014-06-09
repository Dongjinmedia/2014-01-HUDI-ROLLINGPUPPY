package com.puppy.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.puppy.dao.impl.ChatInfoDaoImpl;
import com.puppy.dto.ChatInfo;
import com.puppy.util.Constants;
import com.puppy.util.ServletSessionUtils;
import com.puppy.util.UAgentInfo;

/*
 * 로그인 이후 사용자가 머무는 유일한 페이지
 */
public class MainController implements Controller {
	
	private static final Logger logger = LoggerFactory.getLogger(MainController.class);
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		// 세션 값이 없는 경우 index 페이지로 리다이렉트
		if ( ServletSessionUtils.getStringParameter(request, Constants.SESSION_MEMBER_EMAIL) == null ) {
			response.sendRedirect("/");
			return;
		}
		
//		if ( isThisRequestCommingFromAMobileDevice(request) ) {
//			response.sendRedirect("/mobile");
//		} else {
			RequestDispatcher view = null;
			getEnteredChattingRoomList(request, response);
			view = request.getRequestDispatcher("main.jsp");
			view.forward(request, response); 
//		}
		
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {}
	
	private boolean isThisRequestCommingFromAMobileDevice(HttpServletRequest request){

	    // http://www.hand-interactive.com/m/resources/detect-mobile-java.htm
	    String userAgent = request.getHeader("User-Agent");
	    String httpAccept = request.getHeader("Accept");

	    UAgentInfo detector = new UAgentInfo(userAgent, httpAccept);

	    if (detector.detectMobileQuick()) {
	        return true;
	    }

	    return false;
	}
	
	public void getEnteredChattingRoomList(HttpServletRequest request, HttpServletResponse response) throws IOException {

		Gson gson = new Gson();
		List<ChatInfo> lists = null;
		
		int userId = 0;
		
		try {
			
			userId = ServletSessionUtils.getIntParameter(request, Constants.SESSION_MEMBER_ID);

			if ( userId != 0 ) {
				ChatInfoDaoImpl enteredChatRoomDaoImpl = ChatInfoDaoImpl.getInstance();
				lists = enteredChatRoomDaoImpl.selectMyChatInfo(userId);
			}
		} catch (Exception e ) {
			logger.error("Request Get Entered Chatting Room List With User ID", e);
		}
		request.setAttribute("enteredChattingRoomList", gson.toJson(lists));
	}

}
