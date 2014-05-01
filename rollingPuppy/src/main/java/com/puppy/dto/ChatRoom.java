package com.puppy.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;
public class ChatRoom {
	
	private int id;
	private String title;
	private int max;
	private int grade;
	private String location_name;
	private BigDecimal location_latitude;
	private BigDecimal location_longitude;
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
	public Timestamp getCreated_time() {
		return created_time;
	}
	public void setCreated_time(Timestamp created_time) {
		this.created_time = created_time;
	}
	
	@Override
	public String toString() {
		return "ChatRoom [id=" + id + ", title=" + title + ", max=" + max
				+ ", grade=" + grade + ", location_name=" + location_name
				+ ", location_latitude=" + location_latitude
				+ ", location_longitude=" + location_longitude
				+ ", created_time=" + created_time + ", getId()=" + getId()
				+ ", getTitle()=" + getTitle() + ", getMax()=" + getMax()
				+ ", getGrade()=" + getGrade() + ", getLocation_name()="
				+ getLocation_name() + ", getLocation_latitude()="
				+ getLocation_latitude() + ", getLocation_longitude()="
				+ getLocation_longitude() + ", getCreated_time()="
				+ getCreated_time() + ", getClass()=" + getClass()
				+ ", hashCode()=" + hashCode() + ", toString()="
				+ super.toString() + "]";
	}
}
