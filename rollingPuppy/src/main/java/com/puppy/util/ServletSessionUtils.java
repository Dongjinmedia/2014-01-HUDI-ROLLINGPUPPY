package com.puppy.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class ServletSessionUtils {
	
	public static String getStringParameter(HttpServletRequest request, String key) throws NullPointerException{
		HttpSession session = request.getSession();
		Object object = session.getAttribute(key);
		
		return ( object == null ) ? null : object.toString();
	}

	public static int getIntParameter(HttpServletRequest request, String key) {
		String value = getStringParameter(request, key);
		return ( value == null ) ? 0 : Integer.parseInt(value);
	}

}
