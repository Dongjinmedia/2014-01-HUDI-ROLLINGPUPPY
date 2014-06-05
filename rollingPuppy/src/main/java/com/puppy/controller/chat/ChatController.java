package com.puppy.controller.chat;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.puppy.controller.Controller;
import com.puppy.dao.impl.ChatDaoImpl;
import com.puppy.dto.ChatRoom;
import com.puppy.util.Constants;
import com.puppy.util.JsonChatRoom;
import com.puppy.util.JsonMarker;
import com.puppy.util.ThreeWayResult;

public class ChatController implements Controller {
	
	private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {}
	
	/*
	 * if-else로 request를 비교하는 구문에서는 모두 소문자로 표기한다.
	 * requestURL을 toLowerCase로 변환하고 있기 때문이다.
	 * TODO Annotation처리 할때 리팩토링 
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		//TODO Delete Log into doPost
		logger.info("into doPost");
		
		String requestURL = request.getRequestURI().toLowerCase();
		
		logger.info("requestURL : "+ requestURL);
		
		if ( requestURL.contains("create") ) {
			createChattingRoom(request, response);
		
		} else if (requestURL.contains("foldcurrentchatroom")){
			updateChattingRoomFoldTime(request, response);
		}
	}

	private void updateChattingRoomFoldTime(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		logger.info("into updateChattingRoomFoldTime");
		response.setContentType("application/json");
		
		PrintWriter out = response.getWriter();
		
		ThreeWayResult result = ThreeWayResult.FAIL;
		
		int currentChatRoomNumber = Integer.parseInt(request.getAttribute(Constants.REQUEST_CHATROOM_NUMBER).toString()); 
		int userId = Integer.parseInt(request.getSession().getAttribute(Constants.SESSION_MEMBER_ID).toString());
		
		if ( currentChatRoomNumber !=0 && userId != 0 ) {
			ChatDaoImpl chatDao = ChatDaoImpl.getInstance();
			int successQueryNumber = chatDao.updateCurrentChatRoomFoldTime(userId, currentChatRoomNumber);
			
			if ( successQueryNumber > 0 )
				result = ThreeWayResult.SUCCESS;
			
			logger.info("successQueryNumber : "+successQueryNumber);
		}
		
		out.println(result);
	}

	public void createChattingRoom(HttpServletRequest request, HttpServletResponse response) throws IOException {
		
		//response 형식을 json으로 선언
		response.setContentType("application/json; charset=UTF-8");
		
		//response데이터에 JSON출력을 위한 선언
		PrintWriter out = response.getWriter();
		
		//JSON 데이터를 편하게 사용하기 위한 구글에서 만든 라이브러리 선언
		Gson gson = new Gson();
		
		//result 데이터 (성공여부, JsonMarker데이터)
		Map<String, Object> resultJsonData = new HashMap<String, Object>();
		
		//성공여부 제어를 위한 변수선언
		boolean isSuccess = false;
		
		//request Parameter를 위한 변수선언
		String title =  null;
		int max = 0;
		String name = null;
		BigDecimal latitude = null;
		BigDecimal longitude = null;
		int zoom = 0;
		
		try {
			//각각의 Part객체를 가져온다.
			title = request.getAttribute( Constants.REQUEST_CHATROOM_TITLE ).toString();
			max = Integer.parseInt( request.getAttribute( Constants.REQUEST_CHATROOM_MAX ).toString() );
			name = request.getAttribute( Constants.REQUEST_CHATROOM_NAME ).toString();
			latitude = new BigDecimal( request.getAttribute( Constants.REQUEST_CHATROOM_LATITUDE ).toString() );
			longitude = new BigDecimal( request.getAttribute( Constants.REQUEST_CHATROOM_LONGITUDE ).toString() );
			zoom = Integer.parseInt( request.getAttribute( Constants.REQUEST_CHATROOM_ZOOM ).toString() );
			
			//database에 입력해야하는 모든 데이터가 존재한다면
			if ( title !=  null && max != 0 && name != null && latitude != null && longitude != null && zoom != 0 ) {
				
				//DTO 객체에 데이터설정
				ChatRoom chatRoom = new ChatRoom();
				
				chatRoom.setTitle(title);
				chatRoom.setMax(max);
				chatRoom.setLocationName(name);
				chatRoom.setLocationLatitude(latitude);
				chatRoom.setLocationLongitude(longitude);
				
				//데이터베이스에 새로운 채팅방 데이터를 삽입
				//insert메서드는 Parameter로 전달되는 DTO에 새로 추가되는 데이터베이스 행의 'id'값을 입력해준다. 
				ChatDaoImpl chatDaoImpl = ChatDaoImpl.getInstance();
				int successQueryNumber = chatDaoImpl.insertChatRoom(chatRoom, zoom);
				
				//만약 데이터베이스에 입력이 성공했다면 
				if (successQueryNumber !=0 ) {
					//성공을 표시
					isSuccess = true;
					
					//클라이언트에서 사용하는 데이터만을 모아서 보내기 위한 JsonDTO선언
					//데이터를 모두 담아둔다.
					//자세한 사항은 Util의 getMarkerCentralListFromChatRoomList함수에 설명을 참조하자.
					JsonMarker newMarker = new JsonMarker(chatRoom.getTblMarkerId());
					newMarker.setLocation_name(chatRoom.getLocationName());
					newMarker.setLocation_latitude(chatRoom.getLocationLatitude());
					newMarker.setLocation_longitude(chatRoom.getLocationLongitude());
					
					newMarker.addChatRooms(new JsonChatRoom(chatRoom.getId(), chatRoom.getTitle(), chatRoom.getMax()));
					
					//Marker에 대한 정보를 담은 객체를 최종적으로 return되는 Json 객체에 담는다.
					resultJsonData.put(Constants.JSON_RESPONSE_NEWMARKER, newMarker);
				}
				
			}
		} catch (Exception e) {
			logger.error("getParameterFrom Javascript FormData",e);
			
			//실패를 표시
			isSuccess = false;
		}
		
		//Create ChatRoom의 성공여부를 리턴하는 Json Object에 담는다.
		resultJsonData.put(Constants.JSON_RESPONSE_ISSUCCESS, isSuccess);
		
		//gson을 통해서 HashMap을 JSON형태로 변경 후 response전달
		out.println(gson.toJson(resultJsonData));
	}
}
