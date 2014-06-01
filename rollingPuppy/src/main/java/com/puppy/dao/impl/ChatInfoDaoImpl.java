package com.puppy.dao.impl;

import java.sql.PreparedStatement;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.dao.DAO;
import com.puppy.dao.ChatInfoDao;
import com.puppy.dto.Member;
import com.puppy.dto.ChatInfo;

public class ChatInfoDaoImpl extends DAO implements ChatInfoDao {
	
	private static final Logger logger = LoggerFactory.getLogger(ChatInfoDaoImpl.class);
	
	private static ChatInfoDaoImpl instance = null;
	
	private ChatInfoDaoImpl() {
	}
	
	public static ChatInfoDaoImpl getInstance() {
		return instance == null ? new ChatInfoDaoImpl() : instance;
	}

	@Override
	public List<ChatInfo> selectMyChatInfo(int userId) {
		logger.info("EnteredChatRoomDaoImpl selectEnteredChatRoomList");
		
		PreparedStatement preparedStatement = null;
		List<ChatInfo> lists = null;
		
		try {
			String query = "SELECT "
											+ "crm.tbl_member_id AS user_id, "
											+ "crm.tbl_chat_room_id AS chat_room_id, "
											+ "cr.title AS chat_room_title, "
											+ "cr.max AS max, "
											+ "cr.location_name AS location_name, "
												+ "("
													+ "SELECT COUNT"
																+ "(t_message.id) "
													+ "FROM tbl_message AS t_message "
													+ "INNER JOIN tbl_chat_room_has_tbl_member AS t_has "
													+ "ON t_message.tbl_member_id = t_has.tbl_member_id "
															+ "AND t_message.tbl_chat_room_id = t_has.tbl_chat_room_id "
															+ "AND t_message.created_time > t_has.fold_time "
													+ "WHERE t_message.tbl_member_id = ?"
															+ " AND t_message.tbl_chat_room_id = crm.tbl_chat_room_id"
												+ ") AS unread_message_num, "
												
												+ "("
													+ "SELECT "
																+ "GROUP_CONCAT(t_member.id) "
													+ "FROM tbl_member as t_member "
													+ "INNER JOIN tbl_chat_room_has_tbl_member AS crm2 "
													+ "ON t_member.id = crm2.tbl_member_id "
													+ "WHERE crm.tbl_chat_room_id = crm2.tbl_chat_room_id"
												+ ") AS participant_list "
													
									+ "FROM tbl_chat_room_has_tbl_member AS crm "
									+ "INNER JOIN tbl_chat_room AS cr ON crm.tbl_chat_room_id = cr.id "
									+ "WHERE crm.tbl_member_id = ?";
			
			
			preparedStatement = ConnectionPool.getPreparedStatement(query);
			preparedStatement.setInt(1, userId);
			preparedStatement.setInt(2, userId);
			
			lists = selectList(ChatInfo.class, preparedStatement);
			
		} catch (Exception e) {
			logger.error("Request Create ChattingRoom Error", e);
		}
		
		return lists;
	}

	@Override
	public List<Member> selectAllParticipantData(String totalListString) {
		PreparedStatement preparedStatement = null;
		List<Member> lists = null;
		
		try {
			String query = "SELECT id, nickname_adjective, nickname_noun FROM tbl_member WHERE id in ("+totalListString+")";
			preparedStatement = ConnectionPool.getPreparedStatement(query);
			lists = selectList(Member.class, preparedStatement);
			
		} catch (Exception e) {
			logger.error("Request Create ChattingRoom Error", e);
		}
		
		return lists;
	}

	@Override
	public ChatInfo selectChatInfo(int chatRoomNumber) {
logger.info("EnteredChatRoomDaoImpl selectEnteredChatRoomList");
		
		PreparedStatement preparedStatement = null;
		ChatInfo returnData = null;
		
		try {
			String query = "SELECT "
											+ "crm.tbl_member_id AS user_id, "
											+ "crm.tbl_chat_room_id AS chat_room_id, "
											+ "cr.title AS chat_room_title, "
											+ "cr.max AS max, "
											+ "cr.location_name AS location_name, "
											
												+ "("
													+ "SELECT "
																+ "GROUP_CONCAT(t_member.id) "
													+ "FROM tbl_member as t_member "
													+ "INNER JOIN tbl_chat_room_has_tbl_member AS crm2 "
													+ "ON t_member.id = crm2.tbl_member_id "
													+ "WHERE crm.tbl_chat_room_id = crm2.tbl_chat_room_id"
												+ ") AS participant_list "
													
									+ "FROM tbl_chat_room_has_tbl_member AS crm "
									+ "INNER JOIN tbl_chat_room AS cr ON crm.tbl_chat_room_id = cr.id "
									+ "WHERE cr.id = ?";
			preparedStatement = ConnectionPool.getPreparedStatement(query);
			preparedStatement.setInt(1, chatRoomNumber);
			
			returnData = selectOne(ChatInfo.class, preparedStatement);
			
		} catch (Exception e) {
			logger.error("Request Create ChattingRoom Error", e);
		}
		
		return returnData;
	}
	
}
