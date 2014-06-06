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
import com.puppy.dto.ChatRoom;
import com.puppy.util.Constants;
import com.puppy.util.JsonMarker;
import com.puppy.util.ServletRequestUtils;
import com.puppy.util.Util;

public class ChatListController implements Controller{

	private static final Logger logger = LoggerFactory.getLogger(ChatListController.class);
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
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
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");

		PrintWriter out = response.getWriter();
		Gson gson = new Gson();

		// return할 JSON데이터를 담은 Map객체
		Map<String, Object> resultJsonData = new HashMap<String, Object>();
		boolean isSuccess = false;

		// request Parameter를 위한 변수선언
		float leftTopX = 0;
		float leftTopY = 0;
		float rightBottomX = 0;
		float rightBottomY = 0;

		try {

			leftTopX = ServletRequestUtils.getFloatParameterFromPart(request, Constants.REQUEST_ROOMLIST_LEFTTOPX);
			leftTopY = ServletRequestUtils.getFloatParameterFromPart(request, Constants.REQUEST_ROOMLIST_LEFTTOPY); 

			rightBottomX = ServletRequestUtils.getFloatParameterFromPart(request, Constants.REQUEST_ROOMLIST_RIGHTBOTTOMX); 
			rightBottomY = ServletRequestUtils.getFloatParameterFromPart(request, Constants.REQUEST_ROOMLIST_RIGHTBOTTOMY);

			// Client에서 전달받은 좌상, 우하 좌표를 통한 Query 검색
			// TODO ZOOM LEVEL 별 검색
			ChatDaoImpl chatDaoImpl = ChatDaoImpl.getInstance();
			List<ChatRoom> lists = chatDaoImpl.selectChatRoomListFromPoints(leftTopX, leftTopY, rightBottomX, rightBottomY);

			// 마커를 중심으로 리턴데이터를 정렬.
			// JsonMarker에 대한 자세한 설명은 Util 클래스의
			// getMarkerCentralListFromChatRoomList() 클래스 참조
			List<JsonMarker> returnJsonList = Util.getMarkerCentralListFromChatRoomList(lists);

			// MarkerList를 JSON 데이터에 담는다.
			resultJsonData.put(Constants.JSON_RESPONSE_MARKERLIST, returnJsonList);
			isSuccess = true;

		} catch (Exception e) {
			logger.error("Request Get Chatting Room List With LeftTop, RightBottom Latitude, Longitude", e);
		}

		// 성공여부를 JSON 데이터에 담는다.
		resultJsonData.put(Constants.JSON_RESPONSE_ISSUCCESS, isSuccess);
		out.println(gson.toJson(resultJsonData));
	}
}
