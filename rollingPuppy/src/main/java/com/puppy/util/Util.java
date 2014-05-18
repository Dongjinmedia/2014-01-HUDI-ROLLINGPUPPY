package com.puppy.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.Part;

import com.puppy.dto.ChatRoom;

public class Util {
	/*
	 * getParameterValue From Javascript FormData
	 * 바이너리데이터를 String데이터로 가져오기 위한 함수
	 */
	public static String getStringValueFromPart(Part part) throws IOException {
	    BufferedReader reader = new BufferedReader(new InputStreamReader(part.getInputStream(), "UTF-8"));
	    StringBuilder value = new StringBuilder();
	    char[] buffer = new char[1024];
	    for (int length = 0; (length = reader.read(buffer)) > 0;) {
	        value.append(buffer, 0, length);
	    }
	    return value.toString();
	}

	/*
	 * zoomLevel별 어느거리까지의 마커로 합칠것인지를 위해 존재하는 함수
	 * TODO 알맞은 거리 리서치 (위,경도)
	 */
	public static Float getLatitudeRangeFromZoomLevel(int zoom_level) {
		
		float returnValue = 0;
		if ( zoom_level == 1 ) {
			
			//TODO 알맞은 데이터 리서치
		} else if ( zoom_level == 2 ) { 
			//TODO 알맞은 데이터 리서치
		} else if ( zoom_level == 3 ) {
			//TODO 알맞은 데이터 리서치
		}
		
		return returnValue;
	}

	/*
	 * zoomLevel별 어느거리까지의 마커로 합칠것인지를 위해 존재하는 함수
	 * TODO 알맞은 거리 리서치 (위,경도)
	 */
	public static float getLongitudeRangeFromZoomLevel(int zoom_level) {

		float returnValue = 0;
		
		if ( zoom_level == 1 ) {
			//TODO 알맞은 데이터 리서치
		} else if ( zoom_level == 2 ) { 
			//TODO 알맞은 데이터 리서치
		} else if ( zoom_level == 3 ) {
			//TODO 알맞은 데이터 리서치
		}
		
		return returnValue;
	}

	/*파라미터인 chatRoom Lists는 tbl_marker_id로 정렬되어있다.
	 * 이 메서드는 chatRoom객체를 중심으로 리턴되는 JSON데이터를
	 * Marker중심으로 변환하기 위하여 사용한다.
	 * 즉 예를들어서 리턴되는 Json데이터가 아래와 같을 경우 Javascript에서 매번 Marker값을 구하기위해 계산을 여러번 해야한다.
	 * 
	 * [
	 *  	{ id : "122", location_name: "NHN NEXT1" ....  , tbl_marker_id: "4"}   		//chatRoom의 첫번째 객체에 해당하는 데이터
	 * 		{ id : "123", location_name: "NHN NEXT2" ....  , tbl_marker_id: "5"}    		//chatRoom의 두번째 객체에 해당하는 데이터
	 *      ...
	 *      ...
	 *      ...
	 * ]
	 * 
	 * 왜 여러번 계산해야 하나? 
	 * 맵상에 존재하는 마커를 식별하는 유일한 값은 "마커아이디"값인데, return하는 JSON값이 위와 같은 형태일 경우, 채팅방이 기준으로 sort되어 있기때문이다.
	 * 
	 * 그래서 return data를 아래와 같은 형태로 만들기 위해 이 함수를 만들었다. 
	 * 
	 * {
	 *  	id: "5",  																										//마커를 유일하게 식별하는 아이디값
	 *  	location_name: "NHN NEXT2", 
	 *  	location_latitude: "37.49962920", 
	 *  	location_longitude: "127.03207780", 
	 *  	chatRooms: [.....] 																						//채팅방에 해당하는 chatRoom객체 리스트
	 * } 
	 */
	public static List<JsonMarker> getMarkerCentralListFromChatRoomList(List<ChatRoom> lists) {
		
		if ( lists == null || lists.size() == 0 )
			return null;
		
		//반환할 리스트를 담을 그릇
		List<JsonMarker> returnList = new ArrayList<JsonMarker>();
		
		//현재의 타겟마커를 가리키는 변수선언
		JsonMarker currentMarker = null;
		
		for ( int index = 0 ; index < lists.size() ; ++index ) {
			
			//index에 해당하는 ChatRoom 객체를 변수에 할당 (여러번 불러와서 사용할 거니까, 매번 lists.get(index)하지 않도록)
			ChatRoom room = lists.get(index);
			
			//만약 currentMarker가 null일경우 (맨 처음 실행될때를 의미)
			//currentMarker의 아이디값과 room이 할당되어 있는 marker_id가 다를경우, 새로운 Marker객체를 생성한다.
			if ( currentMarker == null || currentMarker.getId() != room.getTblMarkerId() ) {
				currentMarker = new JsonMarker(room.getTblMarkerId());
				currentMarker.setLocation_latitude(room.getLocationLatitude());
				currentMarker.setLocation_longitude(room.getLocationLongitude());
				currentMarker.setLocation_name(room.getLocationName());
				returnList.add(currentMarker);
			}
			//currentMarker가 room채팅방이 속해야 하는  Marker객체가 맞으므로, chatRoom객체의 데이터를 그대로 더해준다.
			currentMarker.addChatRooms(
					new JsonChatRoom( room.getId(), room.getTitle(), room.getMax() ));
		}

		return returnList;
	}

	public static String getUnderBarlConventionString(String carmelValue) {
		
		StringBuilder sb = new StringBuilder();
		
		for ( int index = 0 ; index < carmelValue.length() ; ++ index ) {
			char target = carmelValue.charAt(index);
			
			if (isUpperCase(target)) {
				sb.append("_");
				sb.append(new Character(target).toString().toLowerCase());
			} else {
				sb.append(target);
			}
		}

		return sb.toString();
	}
	
	private static boolean isUpperCase(char ch) {
	    return ch >= 'A' && ch <= 'Z';
	}
}
