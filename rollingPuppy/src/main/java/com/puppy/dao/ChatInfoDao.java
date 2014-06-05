package com.puppy.dao;

import java.util.List;

import com.puppy.dto.Member;
import com.puppy.dto.ChatInfo;

public interface ChatInfoDao {
	public List<ChatInfo> selectMyChatInfo(int userId);
	public ChatInfo selectChatInfo(int chatRoomNumber);
	public List<Member> selectAllParticipantData(String totalListString);
}
