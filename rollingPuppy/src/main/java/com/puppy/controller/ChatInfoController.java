package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.puppy.dao.impl.ChatInfoDaoImpl;
import com.puppy.dto.ChatInfo;
import com.puppy.util.Constants;
import com.puppy.util.JsonChatInfo;
import com.puppy.util.Util;

/*
 * main.js초기화시 회원이 참여하고 있는
 * 채팅방리스트의 정보를 가져온다.
 * 이때 호출하는 컨트롤러이다.
 * 
 * 해당컨트롤러의 이슈는 client에서는
 * 데이터를 손쉽게 다루기 위하여
 * List데이터를 key, value형태로 Json String을 만들어주는데 있다. 
 */
public class ChatInfoController implements Controller {

	private static final Logger logger = LoggerFactory.getLogger(ChatInfoController.class);

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.info("indo doGet of ChatInfoController");

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		Map<String, JsonChatInfo> returnData = null;
		
		int userId = 0;
		
		try {
			userId = Integer.parseInt(request.getSession().getAttribute( Constants.SESSION_MEMBER_ID ).toString());

			if ( userId != 0 ) {
				ChatInfoDaoImpl myChatInfoDaoImpl = ChatInfoDaoImpl.getInstance();
				List<ChatInfo> chatInfoList = myChatInfoDaoImpl.selectMyChatInfo(userId);
				
				/*
				 * chatInfoList를 이용해서 
				 * 다음과 같은 형태의 데이터를 만들 수 있도록 Util클래스에 요청한다. 
				 * 
				 * {
						"채팅방번호": {
							title: "",
							locationName: "", 
							max: "",
							unreadMessageNum: "",
							participantNum: "", 
							oParticipant: {
								"회원아이디": 
								{
									nickname: "",
								}
							}
						}
					} 
				 */
				returnData = Util.getChatRoomInfoObjectFromQueryResult(chatInfoList);
			}
		} catch (Exception e ) {
			logger.error("Request Get Entered Chatting Room List With User ID", e);
		}
		
		logger.info("User Participant ChattingInfomation : "+gson.toJson(returnData));
		out.println(gson.toJson(returnData));
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		int chatRoomNumber = Integer.parseInt(request.getParameter("chatRoomNumber"));
		
		ChatInfoDaoImpl myChatInfoDaoImpl = ChatInfoDaoImpl.getInstance();
		//MyChatInfo chatInfo = myChatInfoDaoImpl
	}
}