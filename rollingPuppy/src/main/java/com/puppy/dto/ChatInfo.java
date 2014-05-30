package com.puppy.dto;


public class ChatInfo {
	
	private int chatRoomId;
	private String chatRoomTitle;
	private int max;
	private String locationName;
	private long unreadMessageNum;
	private String participantList;
	
	public int getChatRoomId() {
		return chatRoomId;
	}
	public void setChatRoomId(int chatRoomId) {
		this.chatRoomId = chatRoomId;
	}
	public String getChatRoomTitle() {
		return chatRoomTitle;
	}
	public void setChatRoomTitle(String chatRoomTitle) {
		this.chatRoomTitle = chatRoomTitle;
	}
	public int getMax() {
		return max;
	}
	public void setMax(int max) {
		this.max = max;
	}
	public String getLocationName() {
		return locationName;
	}
	public void setLocationName(String locationName) {
		this.locationName = locationName;
	}
	public long getUnreadMessageNum() {
		return unreadMessageNum;
	}
	public void setUnreadMessageNum(long unreadMessageNum) {
		this.unreadMessageNum = unreadMessageNum;
	}
	public String getParticipantList() {
		
		return participantList;
	}
	public void setParticipantList(String participantList) {
		this.participantList = participantList;
	}
}
