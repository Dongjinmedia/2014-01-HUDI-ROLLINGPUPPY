package com.puppy.dao.impl;

import java.util.List;

import com.puppy.dao.DAO;
import com.puppy.dao.MemberDao;
import com.puppy.dto.Member;

/*
* Member Database Table에 접근하기 위한 접근메소드 실제 구현부
*/
public class MemberDaoImpl extends DAO implements MemberDao{

	@Override
	public Member selectDuplicateMemberExists(String email) {
		
		//DB query
		String sql = "SELECT id, email, last_logged_time FROM tbl_member WHERE email = '"+email+"'";
		
		Member member = null;
		
		try {
			//List<Member> lists = (List<Member>) selectList(Member.class, sql);
			//System.out.println("lists :" +lists);
			//member = 	lists.get(0);

			member = (Member) selectOne(Member.class, sql);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return member;
	}

}