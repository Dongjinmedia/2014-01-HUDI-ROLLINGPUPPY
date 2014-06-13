package com.puppy.controller.member;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.puppy.controller.Controller;
import com.puppy.dao.impl.MemberDaoImpl;
import com.puppy.dto.Member;
import com.puppy.util.Constants;
import com.puppy.util.ServletRequestUtils;
import com.puppy.util.ThreeWayResult;
import com.puppy.util.Util;

/*
 * 로그인 요청에 대한 컨트롤러
 */
public class LoginController implements Controller {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		PrintWriter out = response.getWriter();
		
		//초기설정은 예기치못한 에러
		ThreeWayResult loginResult = ThreeWayResult.UNEXPECTED_ERROR;
		
		// POST 정보를 저장합니다.
		String email = ServletRequestUtils.getParameter(request, Constants.REQUEST_EMAIL);
		String password = ServletRequestUtils.getParameter(request, Constants.REQUEST_PASSWORD);
		String keepEmail = ServletRequestUtils.getParameter(request, Constants.REQUEST_KEEP_EMAIL);
		
		//TODO 이건 왜 있는거지?? <윤성>
		if (keepEmail == null) {
			keepEmail = "false";
		}
		
		logger.info(email);
		logger.info(password);
		logger.info(keepEmail);
		
		// POST의 email, pw와 맞는 Member 정보를 가져와서 class에 담습니다.
		MemberDaoImpl memberDao = MemberDaoImpl.getInstance();
		Member member = memberDao.selectCheckLoginInfo(email, password);
		//logger.info(member.toString());
		
		if (member != null && member.getId() != 0 ) {
			//2주동안 유효한 쿠키생성.
			//TODO 이거는 그냥 만드는건가?? 이렇게 하는게 맞는건가 확인해주세요. (by 윤성)
			
			if ( keepEmail.equalsIgnoreCase("true")) {
				Cookie cookie = new Cookie(Constants.COOKIE_LAST_LOGGED_EMAIL, email);
				cookie.setMaxAge(14 * 24 * 60 * 60);
				response.addCookie(cookie);
			} else {
				Cookie[] cookies = request.getCookies();
			    if (cookies != null) {
			        for (int idx = 0; idx < cookies.length; idx++) {
			        	if (cookies[idx].getName().equals(Constants.COOKIE_LAST_LOGGED_EMAIL)) {
			        		cookies[idx].setMaxAge(0);
			        		response.addCookie(cookies[idx]);
			        	}
			        }
			    }
			}
			
			HttpSession session = request.getSession();
			
			//회원의 정확한 식별을 위한 데이터베이스의 index number값을 저장한다.
			session.setAttribute(Constants.SESSION_MEMBER_ID, member.getId());
			session.setAttribute(Constants.SESSION_MEMBER_EMAIL, member.getEmail());
			session.setAttribute(Constants.SESSION_NICKNAME_ADJECTIVE, member.getNicknameAdjective());
			session.setAttribute(Constants.SESSION_NICKNAME_NOUN, member.getNicknameNoun());

			//최종 로그인시간을 업데이트한다.
			int successUpdateQueryNumber = memberDao.updateLastLoggedTime(member.getId());
			if ( successUpdateQueryNumber == 0 )
				logger.warn(email+" Update Last Logged Time Fail.");
			//logger.info("nickname"+member.getNicknameNoun());
			//로그인 성공
			loginResult = ThreeWayResult.SUCCESS;
		} else {
			//일치하는 비밀번호가 데이터베이스에 존재하지 않음
			loginResult = ThreeWayResult.FAIL;
		}
		
		if ( loginResult == ThreeWayResult.SUCCESS ) {
			response.sendRedirect("/main");
		} else if ( loginResult == ThreeWayResult.FAIL){
			out.println(Util.getJavscriptStringValueThatAlertMessageAndMovePrevious("아이디 및 비밀번호를 다시 확인해 주세요"));
		} else {
			out.println(Util.getJavscriptStringValueThatAlertMessageAndMovePrevious("비정상적인 접근입니다."));
		}
	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {}
}
