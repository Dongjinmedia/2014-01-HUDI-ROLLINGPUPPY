package com.puppy.dao;

import com.puppy.dto.Member;

/*
 * Member Database Table에 접근하기 위한 접근메소드 선언
 */
public interface MemberDao {
	public Member selectDuplicateMemberExists(String email);
}