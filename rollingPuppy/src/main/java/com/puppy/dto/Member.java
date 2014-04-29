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
	private String nickname_adjective;
	private String nickname_noun;
	private Timestamp last_logged_time;
	private Timestamp created_time;
	private Timestamp updated_time;
	
	@Override
	public String toString() {
		return "Member [id=" + id + ", email=" + email + ", pw=" + pw
				+ ", sex=" + sex + ", birth=" + birth + ", point=" + point
				+ ", nickname_adjective=" + nickname_adjective
				+ ", nickname_noun=" + nickname_noun + ", last_logged_time="
				+ last_logged_time + ", created_time=" + created_time
				+ ", updated_time=" + updated_time + "]";
	}
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
	public String getNickname_adjective() {
		return nickname_adjective;
	}
	public void setNickname_adjective(String nickname_adjective) {
		this.nickname_adjective = nickname_adjective;
	}
	public String getNickname_noun() {
		return nickname_noun;
	}
	public void setNickname_noun(String nickname_noun) {
		this.nickname_noun = nickname_noun;
	}
	public Timestamp getCreated_time() {
		return created_time;
	}
	public void setCreated_time(Timestamp created_time) {
		this.created_time = created_time;
	}
	public Timestamp getUpdated_time() {
		return updated_time;
	}
	public void setUpdated_time(Timestamp updated_time) {
		this.updated_time = updated_time;
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
	public Timestamp getLast_logged_time() {
		return last_logged_time;
	}
	public void setLast_logged_time(Timestamp last_logged_time) {
		this.last_logged_time = last_logged_time;
	}
}
