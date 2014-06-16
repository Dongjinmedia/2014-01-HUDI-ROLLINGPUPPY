package com.puppy.controller.member;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
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
 * 회원 정보들을 가지고 POST방식으로 들어오는 회원가입 요청을 처리하는 컨트롤러
 * TODO 성별정보 저장하기
 */
public class JoinController implements Controller {
	
	private static final Logger logger = LoggerFactory.getLogger(JoinController.class);
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		PrintWriter out = response.getWriter();
		ThreeWayResult result = ThreeWayResult.UNEXPECTED_ERROR;

		String email = ServletRequestUtils.getParameter(request, Constants.REQUEST_EMAIL);
		String password  = ServletRequestUtils.getParameter(request, Constants.REQUEST_PASSWORD);
		
		MemberDaoImpl memberDao = MemberDaoImpl.getInstance();
		
		Member member = new Member();
		member.setEmail(email);
		member.setPw(password);
		
		int successQueryNumber = memberDao.insertMemberInfo(member);
		
		if ( successQueryNumber == 1 )
			result = ThreeWayResult.SUCCESS;
		else
			result = ThreeWayResult.ALREADY_EXISTS;
		
		if (result == ThreeWayResult.SUCCESS) {
			HttpSession session = request.getSession();
			session.setAttribute(Constants.SESSION_MEMBER_ID, member.getId());
			session.setAttribute(Constants.SESSION_MEMBER_EMAIL, member.getEmail());
			session.setAttribute(Constants.SESSION_NICKNAME_ADJECTIVE, member.getNicknameAdjective());
			session.setAttribute(Constants.SESSION_NICKNAME_NOUN, member.getNicknameNoun());
			
			out.println(Util.getJavscriptStringValueThatAlertMessageAndRedirectParameterURL("이웃님. 반갑습니다.\n초기 닉네임은 자동설정됩니다. ^^\n", "/main"));
		} else if (result == ThreeWayResult.ALREADY_EXISTS) {
			out.println(Util.getJavscriptStringValueThatAlertMessageAndMovePrevious("이미 존재하는 아이디입니다.\n다른 아이디로 시도해주세요."));
		} else {
			out.println(Util.getJavscriptStringValueThatAlertMessageAndMovePrevious("비정상적인 접근입니다."));
		}
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		Map<String, Object> resultJsonData = new HashMap<String, Object>();
		Gson gson = new Gson();
		ThreeWayResult result = ThreeWayResult.SUCCESS;
		
		
		String newbieEmail = request.getParameter(Constants.REQUEST_EMAIL);
		MemberDaoImpl memberDao = MemberDaoImpl.getInstance();
		Member member = memberDao.selectDuplicateMemberExists(newbieEmail);
		
		logger.info("SelectDuplicateMember From JoinController : "+member);
		if( member != null ) {
			result = ThreeWayResult.FAIL;
			logger.info("selectDuplicate Check QueryResult : "+member.toString());
		} else {
			result = ThreeWayResult.SUCCESS;
		}
		resultJsonData.put(Constants.JSON_RESPONSE_3WAY_RESULT, result);
		
		logger.info("selectDuplicate Check ThreeWayResult : "+result);
		out.println(gson.toJson(resultJsonData));
		
	}
}
