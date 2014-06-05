package com.puppy.controller.chat;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.puppy.controller.Controller;
import com.puppy.dao.impl.ChatDaoImpl;
import com.puppy.dto.Message;
import com.puppy.util.Constants;

public class MessageController implements Controller{

	private static final Logger logger = LoggerFactory.getLogger(MessageController.class);
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		Map<String, Object> resultData = new HashMap<String, Object>();
		
		int chatRoomNum = Integer.parseInt(request.getParameter(Constants.REQUEST_CHATROOM_NUMBER).toString());
		int memberId = Integer.parseInt(request.getSession().getAttribute(Constants.SESSION_MEMBER_ID).toString());
		
		ChatDaoImpl chatDao = ChatDaoImpl.getInstance();
		List<Message> recentMessage = chatDao.selectInitMessagesFromChatRoomNumber(chatRoomNum, memberId);
		List<Message> unreadMessage = chatDao.selectUnreadMessage(chatRoomNum, memberId);
		
		resultData.put(Constants.JSON_RESPONSE_RECENT_MESSAGE, recentMessage);
		resultData.put(Constants.JSON_RESPONSE_UNREAD_MESSAGE, unreadMessage);
		
		out.println(gson.toJson(resultData));
		logger.info("getInitMessageFromChatRoomNum : "+gson.toJson(resultData));		
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	}

}
