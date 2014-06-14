package com.puppy.controller.mobile;

import java.io.IOException;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.puppy.controller.Controller;
import com.puppy.dao.impl.ChatInfoDaoImpl;
import com.puppy.dto.ChatInfo;
import com.puppy.util.Constants;
import com.puppy.util.ServletSessionUtils;

public class MobileController implements Controller {
	
	private static final Logger logger = LoggerFactory.getLogger(MobileController.class);
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		/* 개발을 위해 일단은 주석처리 */
		HttpSession session = request.getSession();

		// 세션 값이 없는 경우 index 페이지로 리다이렉트
		if ( session.getAttribute(Constants.SESSION_MEMBER_EMAIL) == null ) {
			response.sendRedirect("/");
			return;
		}
		
		RequestDispatcher view = request.getRequestDispatcher("mobileMain.jsp");
		getEnteredChattingRoomList(request, response);
		view.forward(request, response); 
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
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
