package com.puppy.dao;

import com.puppy.dto.Member;

public interface MemberDao {
	public Member selectDuplicateMemberExists(String email);
}