package com.puppy.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;
public class ChatRoom {
	
	private int id;
	private String title;
	private int max;
	private String location_name;
	private BigDecimal location_latitude;
	private BigDecimal location_longitude;
	private Timestamp created_time;
	private int tbl_marker_id;
	
	public int getTbl_marker_id() {
		return tbl_marker_id;
	}
	public void setTbl_marker_id(int tbl_marker_id) {
		this.tbl_marker_id = tbl_marker_id;
	}
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
}
