package com.puppy.util;

/*
 * 클라이언트에서 채팅방 생성을 요청했을때,
 * 채팅방 생성을 요청한 좌표에 해당하는 마커의 정보를 데이터베이스에서 검색한다.
 * 
 * 그때 "이름이 일치하는" 마커아이디와 "인근거리로 포함되는" 마커아이디를 Query결과로 부터 리턴받기 위한 Temp DTO Class이다.
 */
public class TempMarkerIdClass {
	private long same_name_id;
	private long near_distance_id;
	
	public long getSame_name_id() {
		return same_name_id;
	}
	public void setSame_name_id(long same_name_id) {
		this.same_name_id = same_name_id;
	}
	public long getNear_distance_id() {
		return near_distance_id;
	}
	public void setNear_distance_id(long near_distance_id) {
		this.near_distance_id = near_distance_id;
	}
}
