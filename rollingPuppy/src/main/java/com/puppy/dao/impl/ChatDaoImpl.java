package com.puppy.dao.impl;

import java.sql.PreparedStatement;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.dao.ChatDao;
import com.puppy.dao.DAO;
import com.puppy.dto.ChatRoom;
import com.puppy.dto.Marker;
import com.puppy.dto.Message;
import com.puppy.util.TempMarkerIdClass;
import com.puppy.util.Util;

public class ChatDaoImpl extends DAO implements ChatDao {
	
	private static final Logger logger = LoggerFactory.getLogger(MemberDaoImpl.class);
	
	private static ChatDaoImpl instance = null;
	
	private ChatDaoImpl() {
	}
	
	public static ChatDaoImpl getInstance() {
		return instance == null ? new ChatDaoImpl() : instance;
	}

	@Override
	public int insertChatRoom(ChatRoom chatRoom, int zoom) {
		logger.info("ChatDaoImpl ChatRoomAndGetLastSavedID");
		
		PreparedStatement preparedStatement = null;
		
		//Database 질의를 위한 DTO설정
		Marker marker = new Marker();
		marker.setLocationName(chatRoom.getLocationName());
		marker.setLocationLatitude(chatRoom.getLocationLatitude());
		marker.setLocationLongitude(chatRoom.getLocationLongitude());
		marker.setZoomLevel(zoom);
		
		//채팅방 생성을 요청했던 좌표값에 
		//해당하는 Marker를 검색.
		//만약 해당 좌표값에 해당하는 Marker가 존재하지 않으면 새로 생성한후,
		//새로 생성된 Marker아이디값을 return한다.
		int markerId = selectMarkerIDFromLocationInfo(marker);
		
		//Insert요청에서 삽입에 성공한 행을 저장할 변수
		int successQueryNumber = 0;
		
		//만약 marker아이디값을 가져오는데 실패하면 아래 구문을 실행하지 않고 탈출.
		if ( markerId == 0 ) {
			return 0;
		} else {
			//marker아이디값을 정상적으로 가져온다면 메서드 Parameter인 ChatRoom 객체에 marker_id를 저장한다. (Call by Reference) 
			chatRoom.setTblMarkerId(markerId);
		}
		
		
		try {
			String query = "INSERT INTO tbl_chat_room(title, max, location_name, location_latitude, location_longitude, tbl_marker_id) values (?, ?, ?, ?, ?, ?)";
			
			preparedStatement = ConnectionPool.getInsertPreparedStatement(query);
			preparedStatement.setString(1, chatRoom.getTitle());
			preparedStatement.setInt(2, chatRoom.getMax());
			preparedStatement.setString(3, chatRoom.getLocationName());
			preparedStatement.setBigDecimal(4, chatRoom.getLocationLatitude());
			preparedStatement.setBigDecimal(5, chatRoom.getLocationLongitude());
			preparedStatement.setInt(6, chatRoom.getTblMarkerId());
			
			//query실행후, 데이터베이스에 성공적으로 삽입된 행의 갯수를 리턴한다.
			successQueryNumber = insertQuery(preparedStatement, chatRoom);
			
			//0이면 insert에 실패한 것이다.
			if ( successQueryNumber == 0 )
				return 0;
		} catch (Exception e) {
			logger.error("Request Create ChattingRoom Error", e);
		}
		
		//
		return successQueryNumber;
	}

	/*
	 * Client에서 요청한 화면에 있는 맵에서
	 * 좌상, 우하 좌표사이에 존재하는 마커들을 가져온다.
	 */
	@Override
	public List<ChatRoom> selectChatRoomListFromPoints(float leftTopX,
			float leftTopY, float rightBottomX, float rightBottomY) {
		
		logger.info("ChatDaoImpl ChatRoomAndGetLastSavedID");
		
		PreparedStatement preparedStatement = null;
		List<ChatRoom> lists = null;
		
		//marker_id를 기준으로 정렬한 이유는, return데이터를 입맛에 맞게끔 조작할때 필요하기 때문이다. (밑에 계속)
		try {
			String query = "SELECT * FROM tbl_chat_room "
					+ "WHERE (location_latitude BETWEEN ? AND ?) "
					+ "AND (location_longitude BETWEEN ? AND  ?) ORDER BY tbl_marker_id ASC";
			
			preparedStatement = ConnectionPool.getPreparedStatement(query);
			preparedStatement.setFloat(1, rightBottomY);
			preparedStatement.setFloat(2, leftTopY);
			preparedStatement.setFloat(3, leftTopX);
			preparedStatement.setFloat(4, rightBottomX);
			
			lists = selectList(ChatRoom.class, preparedStatement);
		} catch (Exception e) {
			logger.error("Request Create ChattingRoom Error", e);
		}
		
		return lists;
	}

	@Override
	public int selectMarkerIDFromLocationInfo(Marker marker) {
		//1. Util함수를 통해 zoomlevel에 맞는 하한, 상한값을 가져온다. (위도, 경도상에 인접마커를 검색하기 위한 용도)
		//2. selectQuery를 통해서 장소명, 혹은 zoomLevel에 맞는 마커아이디 값을 Marker객체에 담아온다.
		//3. 만약 zoomLevel을 통한 아이디, 혹은 장소명을 통한 아이디가 존재하면 (1)장소명을 통한 아이디 리턴 혹은 (2)zoomLevel을 통한 아이디를 리턴한다.
		//4. 만약 둘다 존재하지 않을경우, 새로운 Marker를 생성한후, 아이디값을 리턴한다.
		PreparedStatement preparedStatement = null;
		int markerId = 0;
		Float latitudeRange = Util.getLatitudeRangeFromZoomLevel(marker.getZoomLevel());
		Float longitudeRange = Util.getLongitudeRangeFromZoomLevel(marker.getZoomLevel());
		
		
		try {
			/*
			 * IFNULL(a, b)는
			 * a의 결과값이 존재하지 않을경우 b를 리턴하는 쿼리문이다.
			 */
			String query = "SELECT "
													+ "IFNULL ( "
													+ "		(SELECT id FROM tbl_marker WHERE location_name = ?),  0) "
													+ "		AS same_name_id, "
													+ "IFNULL ( "
													+ "		(SELECT id FROM tbl_marker WHERE (location_latitude BETWEEN ? AND ?) AND (location_longitude BETWEEN ? AND ?) ),  0) "
													+ "		AS near_distance_id"
													+ " FROM tbl_marker";
			
			preparedStatement = ConnectionPool.getPreparedStatement(query);
			preparedStatement.setString(1, marker.getLocationName());
			preparedStatement.setFloat(2, marker.getLocationLatitude().floatValue()-latitudeRange);
			preparedStatement.setFloat(3, marker.getLocationLatitude().floatValue()+latitudeRange);
			preparedStatement.setFloat(4, marker.getLocationLongitude().floatValue()-longitudeRange);
			preparedStatement.setFloat(5, marker.getLocationLongitude().floatValue()+longitudeRange);
			
			//TempMarker클래스는 Query문 결과 리턴되는 "이름이 일치하는" 마커아이디와 "인근거리로 포함되는" 마커아이디를 리턴받기 위한 temp class이다.
			TempMarkerIdClass idInstance = selectOne(TempMarkerIdClass.class, preparedStatement);
			
			//지역명이 일치하는 마커데이터가 있을경우
			if ( idInstance.getSame_name_id() != 0 ) {
				markerId = (int) idInstance.getSame_name_id();
				
			//위도, 경도상에 인접마커에 해당하는 데이터가 있을경우
			} else if ( idInstance.getNear_distance_id() != 0 ) {
				markerId = (int) idInstance.getNear_distance_id();
				
			//위의 두가지 경우를 모두 만족하지 않을경우, 새로운 marker데이터를 데이터베이스에 생성하고, 새로추가된 Marker아이디값을 리턴한다.
			} else {
				markerId = insertMarkerAndGetLastSavedID(marker);
			}
			
		} catch (Exception e) {
			logger.error("Request Get Marker Id Error", e);
		}
		
		return markerId;
	}

	/*
	 * 새로운 마커를 데이터베이스에 생성
	 */
	@Override
	public int insertMarkerAndGetLastSavedID(Marker marker) {
		logger.info("ChatDaoImpl insertMarkerAndGetLastSavedID");
		
		//jdbc query문을 객체화 하는 것 
		//statement는 sql injection 에 취약하기 때문에 preparedStatement를 사용
		PreparedStatement preparedStatement = null;
		int markerId = 0;
		
		try {
			String query = "INSERT INTO tbl_marker(location_name, location_latitude, location_longitude, zoom_level) values (?, ?, ?, ?)";
			//connection객체 + sql 쿼리 = preparedStatement
			preparedStatement = ConnectionPool.getInsertPreparedStatement(query);
			preparedStatement.setString(1, marker.getLocationName());
			preparedStatement.setBigDecimal(2, marker.getLocationLatitude());
			preparedStatement.setBigDecimal(3, marker.getLocationLongitude());
			preparedStatement.setInt(4, marker.getZoomLevel());
			
			//쿼리결과로 insert된 데이터베이스 행 갯수가 0 이상일때 (1일때)
			if ( insertQuery(preparedStatement, marker) > 0 ) {
				//새로 생성한 마커아이디를 리턴하기위해 저장
				markerId = marker.getId();
			}
		} catch (Exception e) {
			logger.error("Request Create ChattingRoom Error", e);
		}
		
		return markerId;
	}

	@Override
	public int updateCurrentChatRoomFoldTime(int userId, int currentChatRoomNumber) {
		logger.info("ChatDaoImpl updateCurrentChatRoomFoldTime");
		
		int successQueryNumber = 0;
		try {
			String sql = "UPDATE tbl_chat_room_has_tbl_member SET fold_time = NOW() WHERE tbl_chat_room_id = ? AND tbl_member_id = ?";
			PreparedStatement preparedStatement = ConnectionPool.getPreparedStatement(sql);
			preparedStatement.setInt(1, currentChatRoomNumber);
			preparedStatement.setInt(2, userId);

			successQueryNumber = updateQuery(preparedStatement);
		} catch (Exception e) {
			logger.error("in updateCurrentChatRoomFoldTime", e);
		}
		
		return successQueryNumber;
	}

	@Override
	public List<Message> selectInitMessagesFromChatRoomNumber(int chatRoomNumber, int memberId) {
		logger.info("ChatDaoImpl selectInitMessagesFromChatRoomNumber");
		
		PreparedStatement preparedStatement = null;
		List<Message> list = null;
		
		try {
			String query = "SELECT "
											+ "id, "
											+ "tbl_chat_room_id, "
											+ "tbl_member_id, "
											+ "message, "
											+ "if(tbl_member_id=?, true, false) AS is_my_message, "
											+ "MONTH(created_time) AS month, "
											+ "DAYOFMONTH(created_time) AS day, "
											+ "DATE_FORMAT(created_time, '%H:%i') AS time, "
											+ "DATE_FORMAT(created_time, '%a') AS week"
									+ " FROM tbl_message "
									+ "WHERE tbl_chat_room_id = ? "
									+ "ORDER BY created_time DESC LIMIT 50";
			
			preparedStatement = ConnectionPool.getPreparedStatement(query);
			preparedStatement.setInt(1, memberId);
			preparedStatement.setInt(2, chatRoomNumber);
			
			list = selectList(Message.class, preparedStatement);
		} catch (Exception e) {
			logger.error("Request Create ChattingRoom Error", e);
		}
		
		Collections.reverse(list);
		
		return list;
	}

	@Override
	public List<Message> selectUnreadMessage(int chatRoomNumber, int memberId) {
		logger.info("ChatDaoImpl selectUnreadMessage");
		
		PreparedStatement preparedStatement = null;
		List<Message> list = null;
		
		try {
			String query = "SELECT "
												+ "t_message.id AS id, "
												+ "t_message.tbl_chat_room_id AS tbl_chat_room_id, "
												+ "t_message.tbl_member_id AS tbl_member_id, "
												+ "t_message.message AS message, "
												+ "if(t_message.tbl_member_id=?, true, false) AS is_my_message, "
												+ "MONTH(t_message.created_time) AS month, "
												+ "DAYOFMONTH(t_message.created_time) AS day, "
												+ "DATE_FORMAT(t_message.created_time, '%H:%i') AS time, "
												+ "DATE_FORMAT(t_message.created_time, '%a') AS week "
									+ "FROM tbl_message AS t_message "
									+ "INNER JOIN tbl_chat_room_has_tbl_member AS t_has "
									+ "ON t_message.tbl_member_id = t_has.tbl_member_id "
											+ "AND t_message.tbl_chat_room_id = t_has.tbl_chat_room_id "
											+ "AND t_message.created_time > t_has.fold_time "
									+ "WHERE t_message.tbl_chat_room_id = ?";
			
			preparedStatement = ConnectionPool.getPreparedStatement(query);
			preparedStatement.setInt(1, memberId);
			preparedStatement.setInt(2, chatRoomNumber);
			
			list = selectList(Message.class, preparedStatement);
		} catch (Exception e) {
			logger.error("Request Create ChattingRoom Error", e);
		}
		return list;
	}
	
	//시간기준으로 Message Select
	//public List<Message> selectMoreMessageBeforeParameterTime() {
}
