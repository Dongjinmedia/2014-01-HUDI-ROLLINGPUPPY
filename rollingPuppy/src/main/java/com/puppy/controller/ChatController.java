package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.puppy.dao.impl.ChatDaoImpl;
import com.puppy.dto.ChatRoom;
import com.puppy.util.Constants;
import com.puppy.util.Util;
/*
 * 채팅방에 대한 요청들을 처리할 컨트롤러.
 * URL을 분석해서 해당하는 메소드를 실행하도록 만들어져있다.
 * TODO FrontController Pattern으로 확장
 */
@SuppressWarnings("serial")

//For getParameter From Javascript new FormData (Ajax Request)
@MultipartConfig
public class ChatController extends HttpServlet {
	
	private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		//TODO Delete Log into doGet
		logger.info("into doGet");
	}
	
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		//TODO Delete Log into doPost
		logger.info("into doPost");
		
		String requestURL = request.getRequestURI().toLowerCase();
		
		logger.info("requestURL : "+ requestURL);
		
		if ( requestURL.contains("create") )
			createChattingRoom(request, response);
		//} else if ( requestURL.contains("") )
	}
	
	//logger.info(request.getParameter("test1")); null 값을 반환한다.
	//전달하는 FormData를 Servlet에서는 multipart로 인식한다. 아래의 링크를 확인해보자.
	//http://stackoverflow.com/questions/10292382/html-5-formdata-and-java-servlets
	public void createChattingRoom(HttpServletRequest request, HttpServletResponse response) {
		//response 형식을 json으로 선언
		response.setContentType("application/json");
		//response데이터에 JSON출력을 위한 선언
		PrintWriter out = null;
		//JSON 데이터를 편하게 사용하기 위한 구글에서 만든 라이브러리 선언
		Gson gson = new Gson();
		//result 데이터 (성공여부, 데이터베이스에 추가된 ROOM의 고유식별값 (id))
		Map<String, Object> resultJsonData = new HashMap<String, Object>();
		//성공여부 제어를 위한 변수선언
		boolean isSuccess = false;
		
		//request Parameter를 위한 변수선언
		String title =  null;
		int max = 0;
		String name = null;
		float latitude = 0;
		float longitude = 0;
		
		Part titlePart = null;
		Part maxPart = null;
		Part namePart = null;
		Part latitudePart = null;
		Part longitudePart = null;
		
		try {
			out = response.getWriter();
			
			//이런 형식으로 가져오는 이유는, 메서드 선언부의 내용을 살펴보자.
			titlePart = request.getPart( Constants.REQUEST_CHATROOM_TITLE );
			maxPart = request.getPart( Constants.REQUEST_CHATROOM_MAX );
			namePart = request.getPart( Constants.REQUEST_CHATROOM_NAME );
			latitudePart = request.getPart( Constants.REQUEST_CHATROOM_LATITUDE );
			longitudePart = request.getPart( Constants.REQUEST_CHATROOM_LONGITUDE );
			
			if ( titlePart != null )
				title =  Util.getStringValueFromPart( titlePart );
			
			if ( maxPart != null )
				max = Integer.parseInt( Util.getStringValueFromPart( maxPart ));
			
			if ( namePart != null )
				name = Util.getStringValueFromPart( namePart );
			
			if ( latitudePart != null )
				latitude = Float.parseFloat( Util.getStringValueFromPart( latitudePart ));
			
			if ( longitudePart != null )
				longitude = Float.parseFloat( Util.getStringValueFromPart( longitudePart ));
			
			if ( title !=  null && max != 0 && name != null && latitude != 0 && longitude != 0 ) {
				
				
				ChatRoom chatRoom = new ChatRoom();
				
				chatRoom.setTitle(title);
				chatRoom.setMax(max);
				chatRoom.setLocation_name(name);
				chatRoom.setLocation_latitude(latitude);
				chatRoom.setLocation_longitude(longitude);
				
				ChatDaoImpl chatDaoImpl = ChatDaoImpl.getInstance();
				chatDaoImpl.insertChatRoomAndGetLastSavedID(chatRoom);
				
				
				if (chatRoom.getId() !=0 ) {
					//성공을 표시
					isSuccess = true;
					resultJsonData.put(Constants.JSON_RESPONSE_CHATROOMNUM, chatRoom.getId());
				}
				
			}
		} catch (Exception e) {
			logger.error("getParameterFrom Javascript FormData",e);
			
			//실패를 표시
			isSuccess = false;
		}
		
		//response 데이터를 전달
		resultJsonData.put(Constants.JSON_RESPONSE_ISSUCCESS, isSuccess);
		
		//gson을 통해서 HashMap을 JSON형태로 변경 후 response전달
		out.println(gson.toJson(resultJsonData));
	}
}
