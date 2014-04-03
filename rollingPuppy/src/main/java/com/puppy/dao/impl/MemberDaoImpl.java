package com.puppy.dao.impl;

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
			member = (Member) selectOne(Member.class, sql);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return member;
	}

	@Override
	public Member selectCheckLoginInfo(String email, String pw) {

		//DB query
		String sql = "SELECT id, email, last_logged_time FROM tbl_member WHERE email = '"+email+"' AND pw='"+pw+"'" ;
		
		Member member = null;
		
		try {
			member = (Member) selectOne(Member.class, sql);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return member;
	}

}