package com.puppy.util;

import java.util.Map;


public class JsonChatInfo {
	private String title;
	private String locationName;
	private int max;
	private long unreadMessageNum;
	private Map<String, JsonParticipant> oParticipant;
	
	public JsonChatInfo(String title, String locationName, int max, long unreadMessageNum, Map<String, JsonParticipant> oParticipant) {
		this.title = title;
		this.locationName = locationName;
		this.max = max;
		this.unreadMessageNum = unreadMessageNum;
		this.oParticipant = oParticipant;
	}

	public String getTitle() {
		return title;
	}

	public String getLocationName() {
		return locationName;
	}

	public int getMax() {
		return max;
	}

	public long getUnreadMessageNum() {
		return unreadMessageNum;
	}

	public Map<String, JsonParticipant> getoParticipant() {
		return oParticipant;
	}
}
