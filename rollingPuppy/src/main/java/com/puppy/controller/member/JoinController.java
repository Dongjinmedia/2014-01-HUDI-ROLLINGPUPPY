package com.puppy.controller.member;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.puppy.controller.Controller;
import com.puppy.dao.impl.MemberDaoImpl;
import com.puppy.dto.Member;
import com.puppy.util.Constants;
import com.puppy.util.ServletRequestUtils;
import com.puppy.util.ThreeWayResult;

/*
 * 회원 정보들을 가지고 POST방식으로 들어오는 회원가입 요청을 처리하는 컨트롤러
 * TODO 성별정보 저장하기
 */
public class JoinController implements Controller {
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		Map<String, Object> resultJsonData = new HashMap<String, Object>();
		Gson gson = new Gson();
		ThreeWayResult result = ThreeWayResult.UNEXPECTED_ERROR;

		String email = ServletRequestUtils.getStringParameterFromPart(request, Constants.REQUEST_EMAIL);
		String password  = ServletRequestUtils.getStringParameterFromPart(request, Constants.REQUEST_PASSWORD);;
		
		MemberDaoImpl memberDao = MemberDaoImpl.getInstance();
		
		Member member = new Member();
		member.setEmail(email);
		member.setPw(password);
		
		int successQueryNumber = memberDao.insertMemberInfo(member);
		
		if ( successQueryNumber == 1 )
			result = ThreeWayResult.SUCCESS;
		else
			result = ThreeWayResult.ALREADY_EXISTS;
		
		resultJsonData.put(Constants.JSON_RESPONSE_3WAY_RESULT, result);
		out.println(gson.toJson(resultJsonData));
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
		
		if( member != null ) {
			if ( member.getId() != 0 ) {
				result = ThreeWayResult.FAIL;
			} else {
				result = ThreeWayResult.SUCCESS;
			}
		} 
		resultJsonData.put(Constants.JSON_RESPONSE_3WAY_RESULT, result);
		out.println(gson.toJson(resultJsonData));
		
	}
}