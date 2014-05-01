package com.puppy.dao.impl;

import java.sql.PreparedStatement;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.puppy.dao.ChatDao;
import com.puppy.dao.DAO;
import com.puppy.dto.ChatRoom;

public class ChatDaoImpl extends DAO implements ChatDao {
	
	private static final Logger logger = LoggerFactory.getLogger(MemberDaoImpl.class);
	
	private static ChatDaoImpl instance = null;
	
	private ChatDaoImpl() {
	}
	
	public static ChatDaoImpl getInstance() {
		return instance == null ? new ChatDaoImpl() : instance;
	}

	@Override
	public int insertChatRoomAndGetLastSavedID(ChatRoom chatRoom) {
		logger.info("ChatDaoImpl ChatRoomAndGetLastSavedID");
		
		PreparedStatement preparedStatement = null;
		int successQueryNumber = 0;
		
		try {
			String query = "INSERT INTO tbl_chat_room(title, max, location_name, location_latitude, location_longitude) values (?, ?, ?, ?, ?)";
			
			preparedStatement = ConnectionPool.getInsertPreparedStatement(query);
			preparedStatement.setString(1, chatRoom.getTitle());
			preparedStatement.setInt(2, chatRoom.getMax());
			preparedStatement.setString(3, chatRoom.getLocation_name());
			preparedStatement.setBigDecimal(4, chatRoom.getLocation_latitude());
			preparedStatement.setBigDecimal(5, chatRoom.getLocation_longitude());
			
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
					+ "AND (location_longitude BETWEEN ? AND  ?)";
			
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
			logger.info(chatRoom.getTitle());
		}
		
		return lists;
	}
}
