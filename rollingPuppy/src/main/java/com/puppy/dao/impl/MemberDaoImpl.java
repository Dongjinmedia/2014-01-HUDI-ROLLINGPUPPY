package com.puppy.dao.impl;

import java.sql.PreparedStatement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.dao.DAO;
import com.puppy.dao.MemberDao;
import com.puppy.dto.Member;

/*
* Member Database Table에 접근하기 위한 접근메소드 실제 구현부
* 상속을 받았기 때문에, Method에 대한 일관된 제어가 가능하다.
* Instance는
*/
public class MemberDaoImpl extends DAO implements MemberDao{

	private static final Logger log = LoggerFactory.getLogger(MemberDaoImpl.class);
	private static MemberDaoImpl instance = null;
	
	private MemberDaoImpl() {
	}
	
	public static MemberDaoImpl getInstance() {
		return instance == null ? new MemberDaoImpl() : instance;
	}
	
	@Override
	public Member selectDuplicateMemberExists(String email) {
		log.info("MemberDaoImpl selectDuplicateMemberExists");
		
		Member member = null;
		
		try {
			String sql = "SELECT id, email, last_logged_time FROM tbl_member WHERE email = ?";
			PreparedStatement preparedStatement = ConnectionPool.getPreparedStatement(sql);
			preparedStatement.setString(1, email);

			member = selectOne(Member.class, preparedStatement);
		} catch (Exception e) {
			log.error("in selectDuplicateMemberExists", e);
		}
		
		return member;
	}

	@Override
	public Member selectCheckLoginInfo(String email, String pw) {
		log.info("MemberDaoImpl selectCheckLoginInfo");
		
		Member member = null;
		
		try {
			String sql = "SELECT id, email, nickname_noun, nickname_adjective FROM tbl_member WHERE email = ? AND pw = ?";
			PreparedStatement preparedStatement = ConnectionPool.getPreparedStatement(sql);
			preparedStatement.setString(1, email);
			preparedStatement.setString(2, pw);

			member = selectOne(Member.class, preparedStatement);
		} catch (Exception e) {
			log.error("in selectCheckLoginInfo", e);
		}
		
		return member;
	}

	@Override
	public int insertMemberInfo(Member member) {
		log.info("MemberDaoImpl insertMemberInfo");
		
		PreparedStatement insertPreparedStatement = null;
		int successQueryNumber = 0;
		
		try {
			String nicknameQuery = 
					"SELECT tbl_adjective.adjective AS nickname_adjective, tbl_noun.noun AS nickname_noun "
					+ "FROM tbl_adjective, tbl_noun WHERE tbl_adjective.grade = 3 ORDER BY rand() LIMIT 1;";
			PreparedStatement selectPreparedStatement = ConnectionPool.getPreparedStatement(nicknameQuery);
			Member tempMember = selectOne(Member.class, selectPreparedStatement);
			
			String query = "INSERT INTO tbl_member(email, pw, nickname_adjective, nickname_noun) VALUES (?, ?, ?, ?)";
			insertPreparedStatement = ConnectionPool.getPreparedStatement(query);
			insertPreparedStatement.setString(1, member.getEmail());
			insertPreparedStatement.setString(2, member.getPw());
			insertPreparedStatement.setString(3, tempMember.getNickname_adjective());
			insertPreparedStatement.setString(4, tempMember.getNickname_noun());
			
			successQueryNumber = insertQuery(insertPreparedStatement); 
		} catch (Exception e) {
			log.error("in insertMemberInfo", e);
		}
		
		return successQueryNumber;
	}

}