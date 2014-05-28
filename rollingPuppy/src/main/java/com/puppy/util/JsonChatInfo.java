package com.puppy.util;

import java.util.Map;


public class JsonChatInfo {
	private String title;
	private String locationName;
	private int max;
	private int participantNum;
	private long unreadMessageNum;
	private Map<String, JsonParticipant> oParticipant;
	
	public JsonChatInfo(String title, String locationName, int max, int participantNum, long unreadMessageNum, Map<String, JsonParticipant> oParticipant) {
		this.title = title;
		this.locationName = locationName;
		this.max = max;
		this.participantNum = participantNum;
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
	
	public int getParticipantNum() {
		return participantNum;
	}
}
