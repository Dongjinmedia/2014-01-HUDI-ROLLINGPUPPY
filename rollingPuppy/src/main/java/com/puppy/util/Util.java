package com.puppy.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.http.Part;

public class Util {
	//getParameterValue From Javascript FormData
	public static String getStringValueFromPart(Part part) throws IOException {
	    BufferedReader reader = new BufferedReader(new InputStreamReader(part.getInputStream(), "UTF-8"));
	    StringBuilder value = new StringBuilder();
	    char[] buffer = new char[1024];
	    for (int length = 0; (length = reader.read(buffer)) > 0;) {
	        value.append(buffer, 0, length);
	    }
	    return value.toString();
	}

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
}
