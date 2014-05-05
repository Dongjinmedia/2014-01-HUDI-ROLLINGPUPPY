package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
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
import com.puppy.dto.Marker;
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
		
		String requestURL = request.getRequestURI().toLowerCase();
		
		logger.info("requestURL : "+ requestURL);
		
		if ( requestURL.contains("getlist") ) {
			getChattingRoomList(request, response);
		}
	}
	
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
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
	
	//logger.info(request.getParameter("test1")); null 값을 반환한다.
	//전달하는 FormData를 Servlet에서는 multipart로 인식한다. 아래의 링크를 확인해보자.
	//http://stackoverflow.com/questions/10292382/html-5-formdata-and-java-servlets
	public void createChattingRoom(HttpServletRequest request, HttpServletResponse response) throws IOException {
		//response 형식을 json으로 선언
		response.setContentType("application/json; charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		//response데이터에 JSON출력을 위한 선언
		PrintWriter out = response.getWriter();
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
		BigDecimal latitude = null;
		BigDecimal longitude = null;
		int zoom = 0;
		
		Part titlePart = null;
		Part maxPart = null;
		Part namePart = null;
		Part latitudePart = null;
		Part longitudePart = null;
		Part zoomPart = null;
		
		try {
			//이런 형식으로 가져오는 이유는, 메서드 선언부의 내용을 살펴보자.
			titlePart = request.getPart( Constants.REQUEST_CHATROOM_TITLE );
			maxPart = request.getPart( Constants.REQUEST_CHATROOM_MAX );
			namePart = request.getPart( Constants.REQUEST_CHATROOM_NAME );
			latitudePart = request.getPart( Constants.REQUEST_CHATROOM_LATITUDE );
			longitudePart = request.getPart( Constants.REQUEST_CHATROOM_LONGITUDE );
			zoomPart = request.getPart( Constants.REQUEST_CHATROOM_ZOOM );
			
			if ( titlePart != null )
				title =  Util.getStringValueFromPart( titlePart );
			
			if ( maxPart != null )
				max = Integer.parseInt( Util.getStringValueFromPart( maxPart ));
			
			if ( namePart != null )
				name = Util.getStringValueFromPart( namePart );
			
			if ( latitudePart != null )
				latitude = new BigDecimal( Util.getStringValueFromPart( latitudePart ));
			
			if ( longitudePart != null )
				longitude = new BigDecimal( Util.getStringValueFromPart( longitudePart ));
			
			if ( zoomPart != null )
				zoom = Integer.parseInt( Util.getStringValueFromPart(zoomPart ));
			
			if ( title !=  null && max != 0 && name != null && latitude != null && longitude != null && zoom != 0 ) {
				
				
				ChatRoom chatRoom = new ChatRoom();
				
				chatRoom.setTitle(title);
				chatRoom.setMax(max);
				chatRoom.setLocation_name(name);
				chatRoom.setLocation_latitude(latitude);
				chatRoom.setLocation_longitude(longitude);
				
				ChatDaoImpl chatDaoImpl = ChatDaoImpl.getInstance();
				chatDaoImpl.insertChatRoomAndGetLastSavedID(chatRoom, zoom);
				
				
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
	
	public void getChattingRoomList(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("application/json; charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		Map<String, Object> resultJsonData = new HashMap<String, Object>();
		boolean isSuccess = false;
		
		//request Parameter를 위한 변수선언
		Part leftTopXPart = null;
		Part leftTopYPart = null;
		Part rightBottomXPart = null;
		Part rightBottomYPart = null;
		
		float leftTopX = 0;
		float leftTopY = 0;
		float rightBottomX = 0;
		float rightBottomY = 0;
		
		try {
			
			leftTopXPart = request.getPart( Constants.REQUEST_ROOMLIST_LEFTTOPX);
			leftTopYPart = request.getPart( Constants.REQUEST_ROOMLIST_LEFTTOPY);
			rightBottomXPart = request.getPart( Constants.REQUEST_ROOMLIST_RIGHTBOTTOMX);
			rightBottomYPart = request.getPart( Constants.REQUEST_ROOMLIST_RIGHTBOTTOMY);
			
			
			if ( leftTopXPart != null )
				leftTopX = Float.parseFloat( Util.getStringValueFromPart( leftTopXPart ) );
			
			if ( leftTopYPart != null )
				leftTopY = Float.parseFloat( Util.getStringValueFromPart( leftTopYPart ) );
			
			if ( rightBottomXPart != null )
				rightBottomX = Float.parseFloat( Util.getStringValueFromPart( rightBottomXPart ) );
			
			if ( rightBottomYPart != null )
				rightBottomY = Float.parseFloat( Util.getStringValueFromPart( rightBottomYPart ) );
			
			if ( leftTopX !=0  && leftTopY !=0
				&& rightBottomX != 0
				&& rightBottomY != 0 ) {
				
				ChatDaoImpl chatDaoImpl = ChatDaoImpl.getInstance();
				List<ChatRoom> lists = chatDaoImpl.selectChatRoomListFromPoints(leftTopX, leftTopY, rightBottomX, rightBottomY);
				
				//마커를 중심으로 정렬,
				List<Marker> returnJsonList = Util.getMarkerCentralListFromChatRoomList(lists);
				
				resultJsonData.put(Constants.JSON_RESPONSE_MARKERLIST, returnJsonList);
				isSuccess = true;
			}
			
		} catch (Exception e ) {
			logger.error("Request Get Chatting Room List With LeftTop, RightBottom Latitude, Longitude", e);
		}
		resultJsonData.put(Constants.JSON_RESPONSE_ISSUCCESS, isSuccess);
		logger.info("return data : "+ resultJsonData);
		out.println(gson.toJson(resultJsonData));
	}
}
