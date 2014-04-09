package com.puppy.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.puppy.dao.impl.MemberDaoImpl;
import com.puppy.dto.Member;

public class LoginController extends HttpServlet {

	final String SESSION_NICKNAME_NOUN = "member.nickname_noun";
	final String SESSION_NICKNAME_ADJECTIVE = "member.nickname_adjective";
	final String COOKIE_LAST_LOGGED_EMAIL = "member.lastLoggedEmail";
	
	final String POST_KEEP_LOGIN = "keepLogin";
	final String POST_EMAIL = "email"; 
	final String POST_PW = "pw";
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// POST 정보를 저장합니다.
		String email = request.getParameter(POST_EMAIL);
		String pw = request.getParameter(POST_PW);
		String keepLogin = request.getParameter(POST_KEEP_LOGIN);
		
		if (keepLogin == null) {
			keepLogin = "false";
		}
		
		// POST의 email, pw와 맞는 Member 정보를 가져와서 class에 담습니다.
		MemberDaoImpl memberDao = new MemberDaoImpl();
		Member member = memberDao.selectCheckLoginInfo(email, pw);
		
		if (member == null || member.getId() == 0 ) {
			//Ajax통신으로 구현하기로 했음.
			//Redirection 505 error page.
		}

		//2주동안 유효한 쿠키생성.
		Cookie cookie = new Cookie(COOKIE_LAST_LOGGED_EMAIL, email);
		cookie.setMaxAge(14 * 24 * 60 * 60);
		
		HttpSession session = request.getSession();
		session.setAttribute(SESSION_NICKNAME_ADJECTIVE, member.getNickname_adjective());
		session.setAttribute(SESSION_NICKNAME_NOUN, member.getNickname_noun());

		response.addCookie(cookie);
		response.sendRedirect("/main");
	}
}
