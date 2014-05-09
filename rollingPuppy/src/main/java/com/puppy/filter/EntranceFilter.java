package com.puppy.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

public class EntranceFilter implements Filter{

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		
		HttpServletRequest req = (HttpServletRequest) request;
		String path = req.getRequestURI().substring(req.getContextPath().length());

		if (path.startsWith("/images") 
				|| path.startsWith("/javascripts")
				|| path.startsWith("/stylesheets")) {
			System.out.println("request Resources : "+req.getRequestURI());
		    chain.doFilter(request, response); // Goes to container's own default servlet.
		} else {
			System.out.println("servlet Request : "+req.getRequestURI());
		    request.getRequestDispatcher(req.getRequestURI()).forward(request, response); // Goes to controller servlet.
		}
	}

	@Override
	public void destroy() {
	}
}

