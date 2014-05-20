package com.puppy.dao;

import java.util.List;

import com.puppy.dto.ChatRoom;
import com.puppy.dto.Marker;
import com.puppy.dto.Member;

public interface ChatDao {
	public int insertChatRoom(ChatRoom chatRoom, int zoom);
	public int insertMarkerAndGetLastSavedID(Marker marker);
	public List<ChatRoom> selectChatRoomListFromPoints(float leftTopX, float leftTopY, float rightBottomX, float rightBottomY);
	public int selectMarkerIDFromLocationInfo(Marker marker);
	public List<Member> getChatMemberList(int currentChatRoomNumber);
}