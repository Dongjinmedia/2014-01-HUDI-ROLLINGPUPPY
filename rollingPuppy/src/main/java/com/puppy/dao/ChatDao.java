package com.puppy.dao;

import java.util.List;

import com.puppy.dto.ChatRoom;
import com.puppy.dto.Marker;
import com.puppy.dto.Message;

public interface ChatDao {
	public int insertChatRoom(ChatRoom chatRoom, int zoom);
	public int insertMarkerAndGetLastSavedID(Marker marker);
	public List<ChatRoom> selectChatRoomListFromPoints(float leftTopX, float leftTopY, float rightBottomX, float rightBottomY);
	public int selectMarkerIDFromLocationInfo(Marker marker);
	public int updateCurrentChatRoomFoldTime(int userId, int currentChatRoomNumber);
	public List<Message> selectInitMessagesFromChatRoomNumber(int chatRoomNumber);
	public List<Message> selectUnreadMessage(int chatRoomNum, int memberId);
}