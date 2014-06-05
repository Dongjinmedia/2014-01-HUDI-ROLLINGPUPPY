package com.puppy.dto;

import java.sql.Timestamp;

public class Message {
	private int id;
	private int tblChatRoomId;
	private int tblMemberId;
	private String message;
	
	private long month;
	private long day;
	private String time;
	private String week;
	private long isMyMessage;
	
	public long getIsMyMessage() {
		return isMyMessage;
	}
	public void setIsMyMessage(long isMyMessage) {
		this.isMyMessage = isMyMessage;
	}
	public long getMonth() {
		return month;
	}
	public void setMonth(long month) {
		this.month = month;
	}
	public long getDay() {
		return day;
	}
	public void setDay(long day) {
		this.day = day;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getWeek() {
		return week;
	}
	public void setWeek(String week) {
		this.week = week;
	}
	private Timestamp createdTime;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getTblChatRoomId() {
		return tblChatRoomId;
	}
	public void setTblChatRoomId(int tblChatRoomId) {
		this.tblChatRoomId = tblChatRoomId;
	}
	public int getTblMemberId() {
		return tblMemberId;
	}
	public void setTblMemberId(int tblMemberId) {
		this.tblMemberId = tblMemberId;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Timestamp getCreatedTime() {
		return createdTime;
	}
	public void setCreatedTime(Timestamp createdTime) {
		this.createdTime = createdTime;
	}
}
