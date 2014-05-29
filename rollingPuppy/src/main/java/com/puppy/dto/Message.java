package com.puppy.dto;

import java.sql.Timestamp;

public class Message {
	private int id;
	private int tblChatRoomId;
	private int tblMemberId;
	private String message;
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
