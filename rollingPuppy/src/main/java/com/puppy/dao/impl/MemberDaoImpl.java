package com.puppy.dao.impl;

import java.util.List;

import com.puppy.dao.DAO;
import com.puppy.dao.MemberDao;
import com.puppy.dto.Member;

public class MemberDaoImpl extends DAO implements MemberDao{

	@Override
	public Member selectDuplicateMemberExists(String email) {
		String sql = "SELECT id, email, last_logged_time FROM tbl_member WHERE email = "+email;
		
		Member member = null;
		
		try {
			List<Object> lists = setReflectionDataToModel(Member.class , selectQuery(sql));
			member = (Member) lists.get(0);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return member;
	}

}