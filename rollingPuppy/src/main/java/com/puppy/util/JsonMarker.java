package com.puppy.util;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/*
* 클라이언트에 리턴할 데이터를 담을 Json Data를 위한 DTO클래스
* 기존에 DTO패키지에 존재하는 클래스는 Client에서  필요하지 않은 필드값이 존재하기 때문에,
* 불필요한 파싱, 데이터낭비 등을 방지하기위해
* 기존클래스에서 "클라이언트에서 사용할 JsonData만을 담은 DTO클래스"를 재정의한 것이다.
*/
public class JsonMarker {
	private int id;
	private String location_name;
	private BigDecimal location_latitude;
	private BigDecimal location_longitude;
	//private int zoom_level;
	
	private List<JsonChatRoom> chatRooms = null;

	public JsonMarker(int id) {
		chatRooms = new ArrayList<JsonChatRoom>();
		this.setId(id);
	}
	public List<JsonChatRoom> getChatRooms() {
		return chatRooms;
	}
	public void addChatRooms(JsonChatRoom chatRoom) {
		chatRooms.add(chatRoom);
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getLocation_name() {
		return location_name;
	}
	public void setLocation_name(String location_name) {
		this.location_name = location_name;
	}
	public BigDecimal getLocation_latitude() {
		return location_latitude;
	}
	public void setLocation_latitude(BigDecimal location_latitude) {
		this.location_latitude = location_latitude;
	}
	public BigDecimal getLocation_longitude() {
		return location_longitude;
	}
	public void setLocation_longitude(BigDecimal location_longitude) {
		this.location_longitude = location_longitude;
	}
}
