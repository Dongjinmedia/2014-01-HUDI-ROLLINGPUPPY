package com.puppy.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

public class EntranceFilter implements Filter{

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		
		//HttpServletRequest req = (HttpServletRequest) request;
		//String path = req.getRequestURI().substring(req.getContextPath().length());

		// 다음 필터로 이동
	    chain.doFilter(request, response); 
	    //request.getRequestDispatcher(req.getRequestURI()).forward(request, response); // Goes to controller servlet.
	}

	@Override
	public void destroy() {
	}
}

