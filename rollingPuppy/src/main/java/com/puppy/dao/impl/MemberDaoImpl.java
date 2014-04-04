package com.puppy.dao.impl;

import java.util.List;

import com.puppy.dao.DAO;
import com.puppy.dao.MemberDao;
import com.puppy.dto.Member;

/*
* Member Database Table에 접근하기 위한 접근메소드 실제 구현부
* 상속을 받았기 때문에, Method에 대한 일관된 제어가 가능하다.
*/
public class MemberDaoImpl extends DAO implements MemberDao{

	@Override
	public Member selectDuplicateMemberExists(String email) {
		
		//DB query
		String sql = "SELECT id, email, last_logged_time FROM tbl_member WHERE email = '"+email+"'";
		
		Member member = null;
		
		try {
			member = selectOne(Member.class, sql);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return member;
	}

	@Override
	public Member selectCheckLoginInfo(String email, String pw) {

		//DB query
		//String sql = "SELECT id, email, last_logged_time FROM tbl_member WHERE email = '"+email+"' AND pw='"+pw+"'" ;
		String sql = "SELECT id, email, nickname_noun, nickname_adjective FROM tbl_member WHERE email = '"+email+"' AND pw='"+pw+"'" ;
		
		Member member = null;
		
		try {
			
			Object object = selectOne(Member.class, sql);
			
			if ( object != null )
				member = selectOne(Member.class, sql);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return member;
	}

	@Override
	public boolean insertMemberInfo(Member member) {
		
		String nicknameQuery = "SELECT tbl_adjective.adjective AS nickname_adjective, tbl_noun.noun AS nickname_noun FROM tbl_adjective, tbl_noun WHERE tbl_adjective.grade = 3 ORDER BY rand() LIMIT 1;";
		
		//TODO Update 구현후 리팩토링
		Member tempMember = selectOne(Member.class, nicknameQuery);
		System.out.println(tempMember.toString());
		String query = "INSERT INTO tbl_member(email, pw, nickname_adjective, nickname_noun) VALUES ( '" + member.getEmail() + "', '" + member.getPw() + "', '" + tempMember.getNickname_adjective() + "', '" + tempMember.getNickname_noun() + "');";
		
		return insertQuery(query);
	}

}