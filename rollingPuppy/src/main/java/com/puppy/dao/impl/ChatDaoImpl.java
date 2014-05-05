package com.puppy.dao.impl;

import java.sql.PreparedStatement;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.puppy.dao.ChatDao;
import com.puppy.dao.DAO;
import com.puppy.dto.ChatRoom;
import com.puppy.dto.Marker;
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
	public int insertChatRoomAndGetLastSavedID(ChatRoom chatRoom, int zoom) {
		logger.info("ChatDaoImpl ChatRoomAndGetLastSavedID");
		
		PreparedStatement preparedStatement = null;
		int successQueryNumber = 0;
		
		
		//Marker정보를 가져오기 위한 query실행
		Marker marker = new Marker();
		marker.setLocation_name(chatRoom.getLocation_name());
		marker.setLocation_latitude(chatRoom.getLocation_latitude());
		marker.setLocation_longitude(chatRoom.getLocation_longitude());
		marker.setZoom_level(zoom);
		
		int markerId = selectMarkerIDFromLocationInfo(marker);
		
		if ( markerId == 0 )
			return successQueryNumber; 
		
		
		try {
			String query = "INSERT INTO tbl_chat_room(title, max, location_name, location_latitude, location_longitude, tbl_marker_id) values (?, ?, ?, ?, ?, ?)";
			
			preparedStatement = ConnectionPool.getInsertPreparedStatement(query);
			preparedStatement.setString(1, chatRoom.getTitle());
			preparedStatement.setInt(2, chatRoom.getMax());
			preparedStatement.setString(3, chatRoom.getLocation_name());
			preparedStatement.setBigDecimal(4, chatRoom.getLocation_latitude());
			preparedStatement.setBigDecimal(5, chatRoom.getLocation_longitude());
			preparedStatement.setInt(6, markerId);
			
			successQueryNumber = insertQuery(preparedStatement, chatRoom);
		} catch (Exception e) {
			logger.error("Request Create ChattingRoom Error", e);
		}
		
		return successQueryNumber;
	}

	@Override
	public List<ChatRoom> selectChatRoomListFromPoints(float leftTopX,
			float leftTopY, float rightBottomX, float rightBottomY) {
		
		logger.info("ChatDaoImpl ChatRoomAndGetLastSavedID");
		
		PreparedStatement preparedStatement = null;
		List<ChatRoom> lists = null;
		
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
		
		for (ChatRoom chatRoom : lists) {
			logger.info("================================");
			logger.info("title : "+chatRoom.getTitle());
			logger.info("location_name : "+chatRoom.getLocation_name());
			logger.info("marker_id : "+chatRoom.getTbl_marker_id());
			logger.info("================================");
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
		Float latitudeRange = Util.getLatitudeRangeFromZoomLevel(marker.getZoom_level());
		Float longitudeRange = Util.getLongitudeRangeFromZoomLevel(marker.getZoom_level());
		
		
		try {
			
//			String sampleQuery = "SELECT "
//														+ "IFNULL ( "
//														+ "		(SELECT id FROM tbl_marker WHERE location_name = 'NHN NEXT'),  0) "
//														+ "		AS same_name_id, "
//														+ "id, location_name "
//												+ "FROM tbl_marker "
//												+ "WHERE ( 클릭한 범위-latitudeRange <location_latitude <= 클릭한 범위+latitudeRange ) "
//												+ "AND ( 클릭한 범위-longitudeRange <location_longitude<= 클릭한 범위+longitudeRange )";
			
			String query = "SELECT "
													+ "IFNULL ( "
													+ "		(SELECT id FROM tbl_marker WHERE location_name = ?),  0) "
													+ "		AS same_name_id, "
													+ "IFNULL ( "
													+ "		(SELECT id FROM tbl_marker WHERE (location_latitude BETWEEN ? AND ?) AND (location_longitude BETWEEN ? AND ?) ),  0) "
													+ "		AS near_distance_id"
													+ " FROM tbl_marker";
			
			preparedStatement = ConnectionPool.getPreparedStatement(query);
			preparedStatement.setString(1, marker.getLocation_name());
			preparedStatement.setFloat(2, marker.getLocation_latitude().floatValue()-latitudeRange);
			preparedStatement.setFloat(3, marker.getLocation_latitude().floatValue()+latitudeRange);
			preparedStatement.setFloat(4, marker.getLocation_longitude().floatValue()-longitudeRange);
			preparedStatement.setFloat(5, marker.getLocation_longitude().floatValue()+longitudeRange);
			
			Marker idInstance = selectOne(Marker.class, preparedStatement);
			
			logger.info("idInstance : "+idInstance);
			
			//지역명이 일치하는 마커데이터가 있을경우
			if ( idInstance.getSame_name_id() != 0 ) {
				markerId = (int) idInstance.getSame_name_id();
			//위도, 경도상에 인접마커에 해당하는 데이터가 있을경우
			} else if ( idInstance.getNear_distance_id() != 0 ) {
				markerId = (int) idInstance.getNear_distance_id();
			//위의 두가지 경우를 모두 만족하지 않을경우, 새로운 marker데이터를 생성한다.
			} else {
				markerId = insertMarkerAndGetLastSavedID(marker);
				logger.info("newbiewId : "+markerId);
			}
			
		} catch (Exception e) {
			logger.error("Request Get Marker Id Error", e);
		}
		
		return markerId;
	}

	@Override
	public int insertMarkerAndGetLastSavedID(Marker marker) {
		logger.info("ChatDaoImpl insertMarkerAndGetLastSavedID");
		
		PreparedStatement preparedStatement = null;
		int markerId = 0;
		
		try {
			String query = "INSERT INTO tbl_marker(location_name, location_latitude, location_longitude, zoom_level) values (?, ?, ?, ?)";
			
			preparedStatement = ConnectionPool.getInsertPreparedStatement(query);
			preparedStatement.setString(1, marker.getLocation_name());
			preparedStatement.setBigDecimal(2, marker.getLocation_latitude());
			preparedStatement.setBigDecimal(3, marker.getLocation_longitude());
			preparedStatement.setInt(4, marker.getZoom_level());
			
			if ( insertQuery(preparedStatement, marker) > 0 ) {
				markerId = marker.getId();
			}
		} catch (Exception e) {
			logger.error("Request Create ChattingRoom Error", e);
		}
		
		return markerId;
	}
}
