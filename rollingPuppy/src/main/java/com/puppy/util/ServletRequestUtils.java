package com.puppy.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ServletRequestUtils {

	private static final Logger logger = LoggerFactory.getLogger(ServletRequestUtils.class);
	
	/*
	 * getParameterValue From Javascript FormData
	 * 바이너리데이터를 String데이터로 가져오기 위한 함수
	 */
	
	private static String getStringValueFromPart(Part part) throws IOException {
	    BufferedReader reader = new BufferedReader(new InputStreamReader(part.getInputStream(), "UTF-8"));
	    StringBuilder value = new StringBuilder();
	    char[] buffer = new char[1024];
	    for (int length = 0; (length = reader.read(buffer)) > 0;) {
	        value.append(buffer, 0, length);
	    }
	    return value.toString();
	}
	
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

	public static int  getIntParameterFromPart(HttpServletRequest request, String key) throws IOException, ServletException {
		return Integer.parseInt(getStringParameterFromPart(request, key));
	}
	
	public static String getStringParameterFromPart(HttpServletRequest request, String key) throws IOException, ServletException {
		Part part = request.getPart(key);
		logger.info("part : ", part.toString());
		
		return getStringValueFromPart(part);
	}

	public static BigDecimal getBigDecimalParameterFromPart(HttpServletRequest request, String key) throws IOException, ServletException {
		return new BigDecimal(getStringParameterFromPart(request, key));
	}

	public static float getFloatParameterFromPart(HttpServletRequest request,String key) throws IOException, ServletException {
		return Float.parseFloat(getStringParameterFromPart(request, key));
	}	
}
