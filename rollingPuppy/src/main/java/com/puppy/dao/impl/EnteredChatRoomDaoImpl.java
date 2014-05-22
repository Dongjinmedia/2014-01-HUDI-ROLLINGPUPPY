package com.puppy.dao.impl;

import java.sql.PreparedStatement;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.dao.DAO;
import com.puppy.dao.EnteredChatRoomDao;
import com.puppy.dto.EnteredChatRoom;

public class EnteredChatRoomDaoImpl extends DAO implements EnteredChatRoomDao {
	
	private static final Logger logger = LoggerFactory.getLogger(EnteredChatRoomDaoImpl.class);
	
	private static EnteredChatRoomDaoImpl instance = null;
	
	private EnteredChatRoomDaoImpl() {
	}
	
	public static EnteredChatRoomDaoImpl getInstance() {
		return instance == null ? new EnteredChatRoomDaoImpl() : instance;
	}

	@Override
	public List<EnteredChatRoom> selectEnteredChatRoomList(int userId) {
logger.info("EnteredChatRoomDaoImpl selectEnteredChatRoomList");
		
		PreparedStatement preparedStatement = null;
		List<EnteredChatRoom> lists = null;
		
		try {
			String query = "SELECT crm.tbl_member_id AS user_id, crm.tbl_chat_room_id AS chat_room_id, "
					+ "cr.title AS chat_room_title, cr.max AS max, cr.location_name AS location_name "
					+ "FROM tbl_chat_room_has_tbl_member AS crm "
					+ "INNER JOIN tbl_chat_room AS cr ON crm.tbl_chat_room_id = cr.id "
					+ "WHERE crm.tbl_member_id = ?";

			preparedStatement = ConnectionPool.getPreparedStatement(query);
			preparedStatement.setInt(1, userId);
			
			lists = selectList(EnteredChatRoom.class, preparedStatement);
			
		} catch (Exception e) {
			logger.error("Request Create ChattingRoom Error", e);
		}
		
		return lists;
	}
	
}
