package com.puppy.util;

import javax.servlet.ServletRequest;

public class ServletRequestUtils {

	public static String getParameter(ServletRequest request, String name) {
		return request.getParameter(name);
	}

	public static String getRequiredParameter(ServletRequest request, String name) {
		String value = getParameter(request, name);
		if (value == null) {
			throw new NullPointerException();
		}
		return value;
	}
	
	public static int getIntParameter(ServletRequest request, String name) {
		return Integer.parseInt(getParameter(request, name));
	}

	public static int getIntParameter(ServletRequest request, String name, int defaultValue) {
		String value = getParameter(request, name);
		if (value == null) {
			return defaultValue;
		}
		return Integer.parseInt(getParameter(request, name));
	}
	
	//TODO  getFloatParameter 등등 만들기
}
