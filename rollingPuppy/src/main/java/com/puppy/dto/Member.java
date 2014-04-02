package com.puppy.dto;

import java.sql.Timestamp;

public class Member {
	private int id;
	private String email;
	private Timestamp last_logged_time;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getLast_logged_time() {
		return ""+last_logged_time;
	}
	public void setLast_logged_time(Timestamp last_logged_time) {
		this.last_logged_time = last_logged_time;
	}
}
