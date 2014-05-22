package com.puppy.util;

import static org.junit.Assert.*;

import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;

public class ServletRequestUtilsTest {
	@Test
	public void getParameter() throws Exception {
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.setParameter("test", "경민");
		String result = ServletRequestUtils.getParameter(request, "test");
		assertEquals("경민", result);
	}
	
	@Test
	public void getRequiredParameter() throws Exception {
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.setParameter("test", "경민");
		String result = ServletRequestUtils.getRequiredParameter(request, "test");
		assertEquals("경민", result);
	}
	
	@Test(expected=NullPointerException.class)
	public void getRequiredParameter_isNull() throws Exception {
		ServletRequestUtils.getRequiredParameter(new MockHttpServletRequest(), "test");
	}
	
	@Test
	public void getIntParameter() throws Exception {
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.setParameter("test", "10");
		assertEquals(10, ServletRequestUtils.getIntParameter(request, "test"));
	}
	
	@Test
	public void getIntParameterDefaultValue() throws Exception {
		assertEquals(1, ServletRequestUtils.getIntParameter(new MockHttpServletRequest(), "test", 1));
	}
}
