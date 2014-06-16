package com.puppy.dao;

import com.puppy.dto.Member;

/*
 * Member Database Table에 접근하기 위한 접근메소드 선언
 * MemberDao를 통해서 메소드의 목록을 한눈에 확인하고,
 * 추상화시켜서 관리할 수 있다.
 */
public interface MemberDao {
	public Member selectDuplicateMemberExists(String email);
	public Member selectCheckLoginInfo(String email, String pw);
	public Member selectNicknameFromMemberId(Member member);
	public int insertMemberInfo(Member member);
	public int updateLastLoggedTime(int dbTupleNumber);
}

