package com.puppy.dto;


public class EnteredChatRoom {
	
	private int userId;
	private int chatRoomId;
	private String chatRoomTitle;
	private int max;
	private String locationName;
	
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
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
	
}
