package com.puppy.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class EntranceFilter implements Filter{

	
//	private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {}
	
	//TODO 하단링크방식으로 구현해보자
	//http://slipp.net/wiki/pages/viewpage.action?pageId=19530191
	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
			FilterChain chain) throws IOException, ServletException {
		
		HttpServletResponse response= (HttpServletResponse) servletResponse;
		HttpServletRequest request = (HttpServletRequest) servletRequest;
		
		if ( request.getCharacterEncoding() == null )
			request.setCharacterEncoding("UTF-8");
		
		//TODO Research
		response.setCharacterEncoding("UTF-8");
		
		//String path = req.getRequestURI().substring(req.getContextPath().length());

		// 다음 필터로 이동
	    chain.doFilter(servletRequest, servletResponse); 
	    //request.getRequestDispatcher(req.getRequestURI()).forward(request, response); // Goes to controller servlet.
	}

	@Override
	public void destroy() {
	}
}

