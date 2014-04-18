package com.puppy.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.dao.impl.MemberDaoImpl;
import com.puppy.dto.Member;
import com.puppy.util.Constants;

/*
 * 로그인 요청에 대한 컨트롤러
 */
@SuppressWarnings("serial")
public class LoginController extends HttpServlet {

	private static final Logger log = LoggerFactory.getLogger(LoginController.class);
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		log.info("into doPost");
		
		// POST 정보를 저장합니다.
		String email = request.getParameter(Constants.POST_EMAIL);
		String pw = request.getParameter(Constants.POST_PW);
		String keepLogin = request.getParameter(Constants.POST_KEEP_LOGIN);
		
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
		Cookie cookie = new Cookie(Constants.COOKIE_LAST_LOGGED_EMAIL, email);
		cookie.setMaxAge(14 * 24 * 60 * 60);
		
		HttpSession session = request.getSession();
		
		//회원의 정확한 식별을 위한 데이터베이스의 index number값을 저장한다. 
		session.setAttribute(Constants.SESSION_MEMBER_ID, member.getId());
		session.setAttribute(Constants.SESSION_NICKNAME_ADJECTIVE, member.getNickname_adjective());
		session.setAttribute(Constants.SESSION_NICKNAME_NOUN, member.getNickname_noun());

		response.addCookie(cookie);
		response.sendRedirect("/main");
	}
}
