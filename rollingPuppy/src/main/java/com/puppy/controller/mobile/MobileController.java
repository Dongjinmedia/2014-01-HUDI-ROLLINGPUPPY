package com.puppy.controller.mobile;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.puppy.controller.Controller;

public class MobileController implements Controller {
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		/* 개발을 위해 일단은 주석처리
		HttpSession session = request.getSession();

		// 세션 값이 없는 경우 index 페이지로 리다이렉트
		if ( session.getAttribute(Constants.SESSION_MEMBER_EMAIL) == null ) {
			response.sendRedirect("/");
			return;
		}
		*/
		
		RequestDispatcher view = request.getRequestDispatcher("mobileMain.jsp");
		view.forward(request, response); 
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	}
}
