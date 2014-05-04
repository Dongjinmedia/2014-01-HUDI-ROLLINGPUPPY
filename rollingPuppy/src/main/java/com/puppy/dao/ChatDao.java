package com.puppy.dao;

import java.util.List;
import com.puppy.dto.ChatRoom;
import com.puppy.dto.Marker;

public interface ChatDao {
	public int insertChatRoomAndGetLastSavedID(ChatRoom chatRoom, int zoom);
	public int insertMarkerAndGetLastSavedID(Marker marker);
	public List<ChatRoom> selectChatRoomListFromPoints(float leftTopX, float leftTopY, float rightBottomX, float rightBottomY);
	public int selectMarkerIDFromLocationInfo(Marker marker);
}