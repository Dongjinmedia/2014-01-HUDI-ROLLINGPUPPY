package com.puppy.dao;

import java.util.List;

import com.puppy.dto.MyChatInfo;

public interface MyChatInfoDao {
	public List<MyChatInfo> selectMyChatInfo(int userId);
}
