package com.puppy.dao;

import com.puppy.dto.ChatRoom;

public interface ChatDao {
	public int insertChatRoomAndGetLastSavedID(ChatRoom chatRoom);
}
