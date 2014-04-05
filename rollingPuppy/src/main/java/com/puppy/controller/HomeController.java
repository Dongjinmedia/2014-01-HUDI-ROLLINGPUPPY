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

public class HomeController extends HttpServlet{
	
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
			RequestDispatcher view = request.getRequestDispatcher("index.jsp");
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
			RequestDispatcher view = request.getRequestDispatcher("index.jsp");
			view.forward(request, response); 

			return;			
		}

		
		String nicknameAdjective = (String) session
				.getAttribute(SESSION_NICKNAME_ADJECTIVE);
		String nicknameNoun = (String) session
				.getAttribute(SESSION_NICKNAME_NOUN);


		RequestDispatcher view = request.getRequestDispatcher("main.jsp");
		view.forward(request, response);
		
//		// 나중에 main페이지가 구현되면 그쪽으로 forward 시킵니다.
//		// RequestDispatcher view =
//		// request.getRequestDispatcher("main.jsp");
//		// view.forward(request, response);
//		out.println("Already Loggined!");
//		out.println("member id(Cookie info): " + cookies[idxCookie].getValue());
//		// getSession과 setSession을 만들어야 겠다.
//		out.println("nickname: " + nicknameAdjective + " " + nicknameNoun);
	}
}
