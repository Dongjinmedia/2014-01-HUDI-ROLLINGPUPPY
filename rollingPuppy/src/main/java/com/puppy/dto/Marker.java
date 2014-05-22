package com.puppy.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class Marker {
	private int id;
	private String locationName;
	private BigDecimal locationLatitude;
	private BigDecimal locationLongitude;
	private int zoomLevel;
	private Timestamp createdTime;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
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
	public int getZoomLevel() {
		return zoomLevel;
	}
	public void setZoomLevel(int zoomLevel) {
		this.zoomLevel = zoomLevel;
	}
	public Timestamp getCreatedTime() {
		return createdTime;
	}
	public void setCreatedTime(Timestamp createdTime) {
		this.createdTime = createdTime;
	}
}