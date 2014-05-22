package com.puppy.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class ChatRoom {
	
	private int id;
	private String title;
	private int max;
	private String locationName;
	private BigDecimal locationLatitude;
	private BigDecimal locationLongitude;
	private Timestamp createdTime;
	private int tblMarkerId;
	
	public int getTblMarkerId() {
		return tblMarkerId;
	}
	public void setTblMarkerId(int tblMarkerId) {
		this.tblMarkerId = tblMarkerId;
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
	public String getLocationName() {
		return locationName;
	}
	public void setLocationName(String locationName) {
		this.locationName = locationName;
	}
	public BigDecimal getLocationLatitude() {
		return locationLatitude;
	}
	public void setLocationLatitude(BigDecimal locationLatitude) {
		this.locationLatitude = locationLatitude;
	}
	public BigDecimal getLocationLongitude() {
		return locationLongitude;
	}
	public void setLocationLongitude(BigDecimal locationLongitude) {
		this.locationLongitude = locationLongitude;
	}
	public Timestamp getCreatedTime() {
		return createdTime;
	}
	public void setCreatedTime(Timestamp createdTime) {
		this.createdTime = createdTime;
	}
}
