package com.puppy.dao;

import java.util.List;

import com.puppy.dto.EnteredChatRoom;

public interface EnteredChatRoomDao {
	public List<EnteredChatRoom> selectEnteredChatRoomList(int userId);
}
