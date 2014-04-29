package com.puppy.dto;

import java.sql.Timestamp;

public class ChatRoom {
	
	private int id;
	private String title;
	private int max;
	private int grade;
	private String location_name;
	private float location_latitude;
	private float location_longitude;
	private Timestamp created_time;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public int getMax() {
		return max;
	}
	public void setMax(int max) {
		this.max = max;
	}
	public int getGrade() {
		return grade;
	}
	public void setGrade(int grade) {
		this.grade = grade;
	}
	public String getLocation_name() {
		return location_name;
	}
	public void setLocation_name(String location_name) {
		this.location_name = location_name;
	}
	public float getLocation_latitude() {
		return location_latitude;
	}
	public void setLocation_latitude(float location_latitude) {
		this.location_latitude = location_latitude;
	}
	public float getLocation_longitude() {
		return location_longitude;
	}
	public void setLocation_longitude(float location_longitude) {
		this.location_longitude = location_longitude;
	}
	public Timestamp getCreated_time() {
		return created_time;
	}
	public void setCreated_time(Timestamp created_time) {
		this.created_time = created_time;
	}
}
