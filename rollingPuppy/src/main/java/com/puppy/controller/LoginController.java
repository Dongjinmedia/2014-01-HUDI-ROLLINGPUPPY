package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.puppy.dao.impl.MemberDaoImpl;
import com.puppy.dto.Member;
import com.puppy.util.Constants;
import com.puppy.util.ThreeWayResult;
import com.puppy.util.Util;

/*
 * 로그인 요청에 대한 컨트롤러
 */
@SuppressWarnings("serial")
//For getParameter From Javascript new FormData (Ajax Request)
@MultipartConfig
public class LoginController extends HttpServlet {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		logger.info("into doPost");
		
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		Map<String, Object> resultJsonData = new HashMap<String, Object>();
		Gson gson = new Gson();
		
		//초기설정은 예기치못한 에러
		ThreeWayResult loginResult = ThreeWayResult.UNEXPECTED_ERROR;
		
		// POST 정보를 저장합니다.
		String email = null;
		String password = null;
		String keepLogin = null;
		
		
		Part emailPart = request.getPart(Constants.REQUEST_EMAIL);
		Part passwordPart = request.getPart(Constants.REQUEST_PASSWORD);
		Part keepLoginPart = request.getPart(Constants.REQUEST_KEEP_LOGIN);
		
		if ( emailPart != null ) {
			email = Util.getStringValueFromPart(emailPart);
		}
		
		if ( passwordPart != null ) {
			password = Util.getStringValueFromPart( passwordPart );
		}
		
		if ( keepLoginPart != null ) {
			keepLogin = Util.getStringValueFromPart( keepLoginPart );
		}
		
		//TODO 이건 왜 있는거지?? <윤성>
		if (keepLogin == null) {
			keepLogin = "false";
		}
		
		logger.info(email);
		logger.info(password);
		logger.info(keepLogin);
		
		// POST의 email, pw와 맞는 Member 정보를 가져와서 class에 담습니다.
		MemberDaoImpl memberDao = MemberDaoImpl.getInstance();
		Member member = memberDao.selectCheckLoginInfo(email, password);
		//logger.info(member.toString());
		
		if (member != null && member.getId() != 0 ) {
			//2주동안 유효한 쿠키생성.
			//TODO 이거는 그냥 만드는건가?? 이렇게 하는게 맞는건가 확인해주세요. (by 윤성)
			
			if ( keepLogin.equalsIgnoreCase("true")) {
				Cookie cookie = new Cookie(Constants.COOKIE_LAST_LOGGED_EMAIL, email);
				cookie.setMaxAge(14 * 24 * 60 * 60);
				response.addCookie(cookie);
			}
			
			HttpSession session = request.getSession();
			
			//회원의 정확한 식별을 위한 데이터베이스의 index number값을 저장한다. 
			session.setAttribute(Constants.SESSION_MEMBER_EMAIL, member.getEmail());
			session.setAttribute(Constants.SESSION_NICKNAME_ADJECTIVE, member.getNickname_adjective());
			session.setAttribute(Constants.SESSION_NICKNAME_NOUN, member.getNickname_noun());
			
			//최종 로그인시간을 업데이트한다.
			int successUpdateQueryNumber = memberDao.updateLastLoggedTime(member.getId());
			if ( successUpdateQueryNumber == 0 )
				logger.warn(email+" Update Last Logged Time Fail.");
			
			//로그인 성공
			loginResult = ThreeWayResult.SUCCESS;
			resultJsonData.put(
					Constants.JSON_RESPONSE_NICKNAME, //key 
					member.getNickname_adjective() + " "+member.getNickname_noun()); //value
		} else {
			//일치하는 비밀번호가 데이터베이스에 존재하지 않음
			loginResult = ThreeWayResult.FAIL;
		}
		resultJsonData.put(Constants.JSON_RESPONSE_3WAY_RESULT, loginResult);
		out.println(gson.toJson(resultJsonData));
	}
}
