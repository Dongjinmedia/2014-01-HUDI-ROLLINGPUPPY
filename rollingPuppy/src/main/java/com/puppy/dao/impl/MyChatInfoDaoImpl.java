package com.puppy.dao.impl;

import java.sql.PreparedStatement;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.dao.DAO;
import com.puppy.dao.MyChatInfoDao;
import com.puppy.dto.MyChatInfo;

public class MyChatInfoDaoImpl extends DAO implements MyChatInfoDao {
	
	private static final Logger logger = LoggerFactory.getLogger(MyChatInfoDaoImpl.class);
	
	private static MyChatInfoDaoImpl instance = null;
	
	private MyChatInfoDaoImpl() {
	}
	
	public static MyChatInfoDaoImpl getInstance() {
		return instance == null ? new MyChatInfoDaoImpl() : instance;
	}

	@Override
	public List<MyChatInfo> selectMyChatInfo(int userId) {
logger.info("EnteredChatRoomDaoImpl selectEnteredChatRoomList");
		
		PreparedStatement preparedStatement = null;
		List<MyChatInfo> lists = null;
		
		try {
//			String query = "SELECT crm.tbl_member_id AS user_id, crm.tbl_chat_room_id AS chat_room_id, "
//					+ "cr.title AS chat_room_title, cr.max AS max, cr.location_name AS location_name "
//					+ "FROM tbl_chat_room_has_tbl_member AS crm "
//					+ "INNER JOIN tbl_chat_room AS cr ON crm.tbl_chat_room_id = cr.id "
//					+ "WHERE crm.tbl_member_id = ?";
			
//			String query = "SELECT "
//											+ "crm.tbl_chat_room_id AS chat_room_id, "
//											+ "cr.title AS chat_room_title, "
//											+ "cr.max AS max, cr.location_name AS location_name, "
//											+ "(SELECT "
//													+ "COUNT(id) "
//											+ "FROM tbl_message "
//											+ "WHERE created_time > crm.fold_time) AS unread_message_num "
//											+ "(SELECT "
//													+ "GROUP_CONCAT(t_member.id) "
//											+ "FROM tbl_member as t_member "
//											+ "INNER JOIN tbl_chat_room_has_tbl_member AS crm2 "
//											+ "ON t_member.id = crm2.tbl_member_id "
//											+ "WHERE crm.tbl_chat_room_id = crm2.tbl_chat_room_id) AS participantList "
//									+ "FROM tbl_chat_room_has_tbl_member AS crm "
//									+ "INNER JOIN tbl_chat_room AS cr "
//									+ "ON crm.tbl_chat_room_id = cr.id "
//									+ "WHERE crm.tbl_member_id = ?";
			String query = "SELECT crm.tbl_member_id AS user_id, crm.tbl_chat_room_id AS chat_room_id, cr.title AS chat_room_title, cr.max AS max, cr.location_name AS location_name, (SELECT COUNT(id) FROM tbl_message WHERE created_time > crm.fold_time) AS unread_message_num, (SELECT GROUP_CONCAT(t_member.id) FROM tbl_member as t_member INNER JOIN tbl_chat_room_has_tbl_member AS crm2 ON t_member.id = crm2.tbl_member_id WHERE crm.tbl_chat_room_id = crm2.tbl_chat_room_id) AS participant_list FROM tbl_chat_room_has_tbl_member AS crm INNER JOIN tbl_chat_room AS cr ON crm.tbl_chat_room_id = cr.id WHERE crm.tbl_member_id = ?;";
			
			
			preparedStatement = ConnectionPool.getPreparedStatement(query);
			preparedStatement.setInt(1, userId);
			
			lists = selectList(MyChatInfo.class, preparedStatement);
			
		} catch (Exception e) {
			logger.error("Request Create ChattingRoom Error", e);
		}
		
		return lists;
	}
	
}
