package com.puppy.dao.impl;

import java.sql.PreparedStatement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.dao.DAO;
import com.puppy.dao.NumOfParticipantDao;
import com.puppy.dto.NumOfParticipant;

public class NumOfParticipantDaoImpl extends DAO implements NumOfParticipantDao{

	private static final Logger logger = LoggerFactory.getLogger(NumOfParticipantDaoImpl.class);
	private static NumOfParticipantDaoImpl instance = null;
	
	private NumOfParticipantDaoImpl() {
	}
	
	public static NumOfParticipantDaoImpl getInstance() {
		return instance == null ? new NumOfParticipantDaoImpl() : instance;
	}
	
	@Override
	public int selectNumOfParticipant(int chatRoomId) {
		logger.info("selectNumOfParticipant");
		
		NumOfParticipant result = null;

		try {
			String sql = "SELECT COUNT(tbl_member_id) AS number_of_participant FROM tbl_chat_room_has_tbl_member WHERE tbl_chat_room_id = ?";
			PreparedStatement preparedStatement = ConnectionPool.getPreparedStatement(sql);
			preparedStatement.setInt(1, chatRoomId);
			result = selectOne(NumOfParticipant.class, preparedStatement);

		} catch (Exception e) {
			logger.error("in selectNumOfParticipant", e);
		}
		
		return result.getNumberOfParticipant();
	}
}