package com.puppy.dao.impl;

import java.sql.PreparedStatement;
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
			preparedStatement.setFloat(4, chatRoom.getLocation_latitude());
			preparedStatement.setFloat(5, chatRoom.getLocation_longitude());
			
			successQueryNumber = insertQuery(preparedStatement, chatRoom);
		} catch (Exception e) {
			logger.error("Request Create ChattingRoom Error", e);
		}
		
		return successQueryNumber;
	}
}
