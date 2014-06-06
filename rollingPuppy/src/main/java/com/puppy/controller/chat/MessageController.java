package com.puppy.controller.chat;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.puppy.controller.Controller;
import com.puppy.dao.impl.ChatDaoImpl;
import com.puppy.dto.Message;
import com.puppy.util.Constants;
import com.puppy.util.ServletRequestUtils;
import com.puppy.util.ServletSessionUtils;

public class MessageController implements Controller{

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		Map<String, Object> resultData = new HashMap<String, Object>();
		
		int chatRoomNum = ServletRequestUtils.getIntParameter(request, Constants.REQUEST_CHATROOM_NUMBER); 
		int memberId = ServletSessionUtils.getIntParameter(request, Constants.SESSION_MEMBER_ID);
		
		ChatDaoImpl chatDao = ChatDaoImpl.getInstance();
		List<Message> recentMessage = chatDao.selectInitMessagesFromChatRoomNumber(chatRoomNum, memberId);
		List<Message> unreadMessage = chatDao.selectUnreadMessage(chatRoomNum, memberId);
		
		resultData.put(Constants.JSON_RESPONSE_RECENT_MESSAGE, recentMessage);
		resultData.put(Constants.JSON_RESPONSE_UNREAD_MESSAGE, unreadMessage);
		
		out.println(gson.toJson(resultData));
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {}
}
