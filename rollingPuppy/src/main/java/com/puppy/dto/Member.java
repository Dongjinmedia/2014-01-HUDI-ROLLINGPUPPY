package com.puppy.dto;

import java.sql.Date;
import java.sql.Timestamp;

public class Member {
	private int id;
	private String email;
	private String pw;
	private String sex;
	private Date birth;
	private int point;
	private String nicknameAdjective;
	private String nicknameNoun;
	private Timestamp lastLoggedTime;
	private Timestamp createdTime;
	private Timestamp updatedTime;
	
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public Date getBirth() {
		return birth;
	}
	public void setBirth(Date birth) {
		this.birth = birth;
	}
	public int getPoint() {
		return point;
	}
	public void setPoint(int point) {
		this.point = point;
	}
	public String getNicknameAdjective() {
		return nicknameAdjective;
	}
	public void setNicknameAdjective(String nicknameAdjective) {
		this.nicknameAdjective = nicknameAdjective;
	}
	public String getNicknameNoun() {
		return nicknameNoun;
	}
	public void setNicknameNoun(String nicknameNoun) {
		this.nicknameNoun = nicknameNoun;
	}
	public Timestamp getCreatedTime() {
		return createdTime;
	}
	public void setCreatedTime(Timestamp createdTime) {
		this.createdTime = createdTime;
	}
	public Timestamp getUpdatedTime() {
		return updatedTime;
	}
	public void setUpdatedTime(Timestamp updatedTime) {
		this.updatedTime = updatedTime;
	}
	public String getPw() {
		return pw;
	}
	public void setPw(String pw) {
		this.pw = pw;
	}
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
	public Timestamp getLastLoggedTime() {
		return lastLoggedTime;
	}
	public void setLastLoggedTime(Timestamp lastLoggedTime) {
		this.lastLoggedTime = lastLoggedTime;
	}
}
