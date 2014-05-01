package com.puppy.dao;

import java.util.List;

import com.puppy.dto.ChatRoom;

public interface ChatDao {
	public int insertChatRoomAndGetLastSavedID(ChatRoom chatRoom);
	public List<ChatRoom> selectChatRoomListFromPoints(float leftTopX, float leftTopY, float rightBottomX, float rightBottomY);
}
