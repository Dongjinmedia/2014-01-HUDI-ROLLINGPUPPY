package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.puppy.dao.impl.MemberDaoImpl;
import com.puppy.dto.Member;

public class LoginController extends HttpServlet {

	final static String POST_KEEP_LOGIN = "keepLogin";
	final String SESSION_NICKNAME_NOUN = "puppyMember.nickname_noun";
	final String SESSION_NICKNAME_ADJECTIVE = "puppyMember.nickname_adjective";
	final String COOKIE_MEMBER_ID = "puppyMember.Id";

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		PrintWriter out = response.getWriter(); // 웹페이지에 띄우는 것

		// Session과 Cookie를 불러옵니다.
		HttpSession session = request.getSession();
		Cookie[] cookies = request.getCookies();

		// 저장된 쿠키가 없다면 로그인 페이지로 보냅니다.
		if (cookies == null) {
			RequestDispatcher view = request.getRequestDispatcher("login.jsp");
			view.forward(request, response); // login 이라고만 써도 login.jsp를 띄워준

			return;
		}

		// 쿠키를 돌면서 우리 서비스에서 생성한 쿠키가 있는지, 있다면 값이 유효한지 검사합니다.
		// 우리 서비스에서 쿠키가 없는 경우 로그인 페이지로 보냅니다.
		ArrayList<String> listCookieName = new ArrayList<String>();
		// cookie
		for (int idx = 0; idx < cookies.length; idx++) {
			listCookieName.add(cookies[idx].getName());
		}
		int idxCookie = listCookieName.indexOf(COOKIE_MEMBER_ID); 

		if (idxCookie == -1) {
			RequestDispatcher view = request.getRequestDispatcher("login.jsp");
			view.forward(request, response); 

			return;			
		}

		
		String nicknameAdjective = (String) session
				.getAttribute(SESSION_NICKNAME_ADJECTIVE);
		String nicknameNoun = (String) session
				.getAttribute(SESSION_NICKNAME_NOUN);


		// 나중에 main페이지가 구현되면 그쪽으로 forward 시킵니다.
		// RequestDispatcher view =
		// request.getRequestDispatcher("main.jsp");
		// view.forward(request, response);
		out.println("Already Loggined!");
		out.println("member id(Cookie info): " + cookies[idxCookie].getValue());
		// getSession과 setSession을 만들어야 겠다.
		out.println("nickname: " + nicknameAdjective + " " + nicknameNoun);

	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		PrintWriter out = response.getWriter(); // 웹페이지에 띄우는 것

		// Session과 Cookie를 불러옵니다.
//		HttpSession session = request.getSession();
		Cookie[] cookies = request.getCookies();

		// POST로 넘어온 경우는 로그인 버튼을 누른 것!
		// 따라서 Cookie를 초기화 합니다.
		invaildateCookies(response, cookies);

		// POST 정보를 저장합니다.
		String email = request.getParameter("email");
		String pw = request.getParameter("pw");
		String keepLogin = request.getParameter(POST_KEEP_LOGIN);
		if (keepLogin == null) {
			keepLogin = "false";
		}

		// POST의 email, pw와 맞는 Member 정보를 가져와서 class에 담습니다.
		Member member = getMember(email, pw);
		if (member == null) {
			out.println("No such member! Try again.");
		}

		// int와 같은 기본 자료형에는 toString이 없더라고요. Integer로 캐스팅 후에 toString 사용했습니다. 
		String id = ((Integer) member.getId()).toString();
		String nicknameAdjective = member.getNickname_adjective();
		String nicknameNoun = member.getNickname_noun();
		
		Cookie newCookie = createCookie(COOKIE_MEMBER_ID, id, keepLogin);
		response.addCookie(newCookie);
//		session.setAttribute(SESSION_NICKNAME_ADJECTIVE, nicknameAdjective);
//		session.setAttribute(SESSION_NICKNAME_NOUN, nicknameNoun);
//		session.setMaxInactiveInterval(60 * 30);

		out.println("login success");
		out.println("member id: " + id);
		out.println("keep login: " + keepLogin);

		if (nicknameAdjective.equals("") || nicknameNoun.equals("")) {
			// 닉네임이 없다. 나중에 닉네임 가져오는 페이지로 request 보내자.
			out.println("but no nickname T.T");
		} else {
			out.println("nickname: " + nicknameAdjective + " " + nicknameNoun);
		}

	}

	private Member getMember(String email, String pw) {
		MemberDaoImpl memberDao = new MemberDaoImpl();
		Member member = memberDao.selectCheckLoginInfo(email, pw);

		return member;
	}

	private Cookie createCookie(String cookieName, String cookieValue,
			String keepLogin) {
		// cookieName을 key로, cookieValue를 value로 하는 쿠키를 생성합니다.
		Cookie cookie = new Cookie(cookieName, cookieValue);

		// 쿠키 저장 시간을 정합니다.
		if (keepLogin == "true") {
			// (초 * 분 * 시 * 일 == 60초 * 60분 * 24시간 * 30일)
			cookie.setMaxAge(60 * 60 * 24 * 30);
		} else {
			// (초 * 분 == 60초 * 30분)
			cookie.setMaxAge(60 * 30);
		}

		return cookie;
	}
	
	private void invaildateCookies(HttpServletResponse response,
			Cookie[] cookies) {
		for (Cookie cookie : cookies) {
			cookie.setMaxAge(0);
			response.addCookie(cookie);
		}
	}

}
