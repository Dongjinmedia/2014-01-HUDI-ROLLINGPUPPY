package com.puppy.dto;

import java.math.BigDecimal;

public class Bookmark {
	private int id;
	private int memberId;
	private String bookmarkName;
	private String locationName;
	private BigDecimal locationLatitude;
	private BigDecimal locationLongitude;

	public String getBookmarkName() {
		return bookmarkName;
	}
	
	public void setBookmarkName(String bookmarkName) {
		this.bookmarkName = bookmarkName;
	}
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public int getMemberId() {
		return memberId;
	}
	
	public void setMemberId(int memberId) {
		this.memberId = memberId;
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
}
