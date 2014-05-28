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
import com.puppy.dao.impl.MyChatInfoDaoImpl;
import com.puppy.dto.Member;
import com.puppy.dto.MyChatInfo;
import com.puppy.util.Constants;
import com.puppy.util.JsonChatInfo;
import com.puppy.util.Util;

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
				MyChatInfoDaoImpl myChatInfoDaoImpl = MyChatInfoDaoImpl.getInstance();
				List<MyChatInfo> chatInfoList = myChatInfoDaoImpl.selectMyChatInfo(userId);

				//myChatInfo로부터 참여자 정보 가져오기
				Map<String, List<String>> participantsArrayList = Util.getParticipantListFromChatInfoList(chatInfoList);
				
				//참여자 정보에 해당하는 닉네임 등의 채팅에 필요한 정보 가져오기
				String totalListString = Util.getTotalStringList(chatInfoList);
				List<Member> memberList = myChatInfoDaoImpl.selectAllParticipantFromChatRoomId(totalListString); 
				
				for (Member member : memberList) {
					logger.info("member nickname : "+member.getNicknameAdjective() +" "+member.getNicknameNoun());
				}
				
				
				returnData = Util.getChatRoomInfoObjectFromQueryResult(chatInfoList);
			}
		} catch (Exception e ) {
			logger.error("Request Get Entered Chatting Room List With User ID", e);
		}
		
		out.println(gson.toJson(returnData));
		logger.info(gson.toJson(returnData));
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}
}