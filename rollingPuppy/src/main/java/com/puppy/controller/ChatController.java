package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.puppy.dao.impl.ChatDaoImpl;
import com.puppy.dto.ChatRoom;
import com.puppy.util.Constants;
import com.puppy.util.JsonChatRoom;
import com.puppy.util.JsonMarker;
import com.puppy.util.Util;

public class ChatController implements Controller {
	
	private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		
		String requestURL = request.getRequestURI().toLowerCase();
		
		logger.info("requestURL : "+ requestURL);
		
		//TODO 현재 Client에서 POST요청으로 처리하도록 해서
		//이 메서드는 실행되지 않고 있다. Research 이후 GET방식으로 변경해야 한다.
		if ( requestURL.contains("getlist") ) {
			getChattingRoomList(request, response);
		}
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		//TODO Delete Log into doPost
		logger.info("into doPost");
		
		String requestURL = request.getRequestURI().toLowerCase();
		
		logger.info("requestURL : "+ requestURL);
		
		if ( requestURL.contains("create") ) {
			createChattingRoom(request, response);
		
		//TODO getChattingRoomList영역을 GET방식으로 변경해야 한다.
		//현재 GET요청에서는 에러가 발생중이다.
		} else if ( requestURL.contains("getlist") ) {
			getChattingRoomList(request, response);
		}
	}

	public void createChattingRoom(HttpServletRequest request, HttpServletResponse response) throws IOException {
		
		//response 형식을 json으로 선언
		response.setContentType("application/json; charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		
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
			max = (Integer) request.getAttribute( Constants.REQUEST_CHATROOM_MAX );
			name = request.getAttribute( Constants.REQUEST_CHATROOM_NAME ).toString();
			latitude = new BigDecimal( request.getAttribute( Constants.REQUEST_CHATROOM_LATITUDE ).toString() );
			longitude = new BigDecimal( request.getAttribute( Constants.REQUEST_CHATROOM_LONGITUDE ).toString() );
			zoom = (Integer) request.getAttribute( Constants.REQUEST_CHATROOM_ZOOM );
			
			//database에 입력해야하는 모든 데이터가 존재한다면
			if ( title !=  null && max != 0 && name != null && latitude != null && longitude != null && zoom != 0 ) {
				
				//DTO 객체에 데이터설정
				ChatRoom chatRoom = new ChatRoom();
				
				chatRoom.setTitle(title);
				chatRoom.setMax(max);
				chatRoom.setLocation_name(name);
				chatRoom.setLocation_latitude(latitude);
				chatRoom.setLocation_longitude(longitude);
				
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
					JsonMarker newMarker = new JsonMarker(chatRoom.getTbl_marker_id());
					newMarker.setLocation_name(chatRoom.getLocation_name());
					newMarker.setLocation_latitude(chatRoom.getLocation_latitude());
					newMarker.setLocation_longitude(chatRoom.getLocation_longitude());
					
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
	
	/*
	 * 지도상에서 dragEnd이벤트를 감지해 Server로 Ajax요청을 한다.
	 * 이는 현재 드레그해서 이동한 새로운 지도의 VIew에 존재하는,
	 * 모든 마커정보를 가져오기 위함이다.
	 * 
	 * Client에서는 
	 * 좌상단의 latitude, longitude
	 * 우하단의 latitude, longitude정보를 formData에 담아서 전송하고 있다.
	 * 
	 * 이 함수에서는 위와같이 Client에서 전달해주는 좌표 정보를 이용해서
	 * 데이터베이스에서 좌상단, 우하단 좌표사이에 존재하는 마커를 검색한다.
	 */
	public void getChattingRoomList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("application/json");
		
		//한글데이터 전달을 위해 설정. 추후 filter설정으로 변경
		//TODO 한글 Encoding Filter설정
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		
		//return할 JSON데이터를 담은 Map객체
		Map<String, Object> resultJsonData = new HashMap<String, Object>();
		boolean isSuccess = false;
		
		//request Parameter를 위한 변수선언
		float leftTopX = 0;
		float leftTopY = 0;
		float rightBottomX = 0;
		float rightBottomY = 0;
		
		try {
			
			//TODO Object To Float에 대한 방법이 이것밖에 없는가..?
			leftTopX = Float.parseFloat( request.getAttribute( Constants.REQUEST_ROOMLIST_LEFTTOPX).toString() );
			leftTopY = Float.parseFloat( request.getAttribute( Constants.REQUEST_ROOMLIST_LEFTTOPY).toString() );
			rightBottomX = Float.parseFloat( request.getAttribute( Constants.REQUEST_ROOMLIST_RIGHTBOTTOMX).toString() );
			rightBottomY = Float.parseFloat( request.getAttribute( Constants.REQUEST_ROOMLIST_RIGHTBOTTOMY).toString() );
			
			if ( leftTopX !=0  && leftTopY !=0
				&& rightBottomX != 0
				&& rightBottomY != 0 ) {
				
				//Client에서 전달받은 좌상, 우하 좌표를 통한 Query 검색
				//TODO ZOOM LEVEL 별 검색
				ChatDaoImpl chatDaoImpl = ChatDaoImpl.getInstance();
				List<ChatRoom> lists = chatDaoImpl.selectChatRoomListFromPoints(leftTopX, leftTopY, rightBottomX, rightBottomY);
				
				//마커를 중심으로 리턴데이터를 정렬. 
				//JsonMarker에 대한 자세한 설명은 Util 클래스의 getMarkerCentralListFromChatRoomList() 클래스 참조 
				List<JsonMarker> returnJsonList = Util.getMarkerCentralListFromChatRoomList(lists);
				
				//MarkerList를 JSON 데이터에 담는다.
				resultJsonData.put(Constants.JSON_RESPONSE_MARKERLIST, returnJsonList);
				isSuccess = true;
			}
			
		} catch (Exception e ) {
			logger.error("Request Get Chatting Room List With LeftTop, RightBottom Latitude, Longitude", e);
		}
		
		//성공여부를 JSON 데이터에 담는다.
		resultJsonData.put(Constants.JSON_RESPONSE_ISSUCCESS, isSuccess);
		out.println(gson.toJson(resultJsonData));
	}
}
