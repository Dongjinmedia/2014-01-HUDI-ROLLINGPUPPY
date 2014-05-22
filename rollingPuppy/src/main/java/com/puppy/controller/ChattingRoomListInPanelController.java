package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.puppy.dao.impl.EnteredChatRoomDaoImpl;
import com.puppy.dto.EnteredChatRoom;
import com.puppy.util.Constants;

public class ChattingRoomListInPanelController implements Controller {

	private static final Logger logger = LoggerFactory.getLogger(ChattingRoomListInPanelController.class);

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.info("indo doGet of ChattingRoomListInPanelController");

		String userAction = request.getParameter("userAction");
		
		if( userAction == "selectChattingRoomListPanel")
			getEnteredChattingRoomList(request, response);
		
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}
	
	public void getEnteredChattingRoomList(HttpServletRequest request, HttpServletResponse response) throws IOException {

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		List<EnteredChatRoom> lists = null;
		
		int userId = 0;
		
		try {
			userId = Integer.parseInt(request.getSession().getAttribute( Constants.SESSION_MEMBER_ID ).toString());

			if ( userId != 0 ) {
				EnteredChatRoomDaoImpl enteredChatRoomDaoImpl = EnteredChatRoomDaoImpl.getInstance();
				lists = enteredChatRoomDaoImpl.selectEnteredChatRoomList(userId);
			}
		} catch (Exception e ) {
			logger.error("Request Get Entered Chatting Room List With User ID", e);
		}
		
		out.println(gson.toJson(lists));
		logger.info(gson.toJson(lists));
	}
	
}