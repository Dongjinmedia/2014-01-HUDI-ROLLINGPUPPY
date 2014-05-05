package com.puppy.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class Marker {
	@Override
	public String toString() {
		return "Marker [id=" + id + ", location_name=" + location_name
				+ ", location_latitude=" + location_latitude
				+ ", location_longitude=" + location_longitude
				+ ", zoom_level=" + zoom_level + ", created_time="
				+ created_time + ", same_name_id=" + same_name_id
				+ ", near_distance_id=" + near_distance_id + ", chatRooms="
				+ chatRooms + ", getNear_distance_id()="
				+ getNear_distance_id() + ", getSame_name_id()="
				+ getSame_name_id() + ", getChatRooms()=" + getChatRooms()
				+ ", getId()=" + getId() + ", getLocation_name()="
				+ getLocation_name() + ", getLocation_latitude()="
				+ getLocation_latitude() + ", getLocation_longitude()="
				+ getLocation_longitude() + ", getZoom_level()="
				+ getZoom_level() + ", getCreated_time()=" + getCreated_time()
				+ ", getClass()=" + getClass() + ", hashCode()=" + hashCode()
				+ ", toString()=" + super.toString() + "]";
	}

	private int id;
	private String location_name;
	private BigDecimal location_latitude;
	private BigDecimal location_longitude;
	private int zoom_level;
	private Timestamp created_time;
	
	//tempValue
	private long same_name_id;
	private long near_distance_id;

	public long getNear_distance_id() {
		return near_distance_id;
	}
	public void setNear_distance_id(long near_distance_id) {
		this.near_distance_id = near_distance_id;
	}
	public long getSame_name_id() {
		return same_name_id;
	}
	public void setSame_name_id(long same_name_id) {
		this.same_name_id = same_name_id;
	}
	
	//tempValue
	List<ChatRoom> chatRooms = null;

	public Marker(int id) {
		chatRooms = new ArrayList<ChatRoom>();
		this.setId(id);
	}
	
	//TODO 필요없으면 삭제하자
	public List<ChatRoom> getChatRooms() {
		return chatRooms;
	}
	
	public void addChatRooms(ChatRoom chatRoom) {
		chatRooms.add(chatRoom);
	}
	
	//getter setter start
	
	public Marker() {	}
	
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
	public int getZoom_level() {
		return zoom_level;
	}
	public void setZoom_level(int zoom_level) {
		this.zoom_level = zoom_level;
	}
	public Timestamp getCreated_time() {
		return created_time;
	}
	public void setCreated_time(Timestamp created_time) {
		this.created_time = created_time;
	}
}
