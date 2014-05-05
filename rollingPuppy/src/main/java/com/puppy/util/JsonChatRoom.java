package com.puppy.util;

/*
 * 클라이언트에 리턴할 데이터를 담을 Json Data를 위한 DTO클래스
 * 기존에 DTO패키지에 존재하는 클래스는 Client에서  필요하지 않은 필드값이 존재하기 때문에,
 * 불필요한 파싱, 데이터낭비 등을 방지하기위해
 * 기존클래스에서 "클라이언트에서 사용할 JsonData만을 담은 DTO클래스"를 재정의한 것이다.
 */
public class JsonChatRoom {
	private int id;
	private String title;
	private int max;
	
	public JsonChatRoom(int id, String title, int max) {
		this.id = id;
		this.title = title;
		this.max = max;
	}
	public int getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public int getMax() {
		return max;
	}
}
