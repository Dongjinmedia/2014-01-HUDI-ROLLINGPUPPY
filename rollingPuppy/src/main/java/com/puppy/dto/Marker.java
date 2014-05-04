package com.puppy.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class Marker {
	private int id;
	private String location_name;
	private BigDecimal location_latitude;
	private BigDecimal location_longitude;
	private int zoom_level;
	private Timestamp created_time;
	
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
