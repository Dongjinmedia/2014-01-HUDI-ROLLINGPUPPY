	package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
 * 회원 정보들을 가지고 POST방식으로 들어오는 회원가입 요청을 처리하는 컨트롤러
 * TODO 성별정보 저장하기
 */
@SuppressWarnings("serial")
//For getParameter From Javascript new FormData (Ajax Request)
@MultipartConfig
public class JoinController  extends HttpServlet {
	
	private static final Logger logger = LoggerFactory.getLogger(JoinController.class);
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		logger.info("into doPost");
		
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		Map<String, Object> resultJsonData = new HashMap<String, Object>();
		Gson gson = new Gson();
		ThreeWayResult result = ThreeWayResult.UNEXPECTED_ERROR;

		String email = null;
		String password = null;
		
		Part emailPart = request.getPart(Constants.REQUEST_EMAIL);
		Part passwordPart = request.getPart(Constants.REQUEST_PASSWORD);
		
		if ( emailPart != null )
			email = Util.getStringValueFromPart( emailPart );
		
		if ( passwordPart != null )
			password = Util.getStringValueFromPart( passwordPart );
		
		if ( email != null && password != null ) {
			MemberDaoImpl memberDao = MemberDaoImpl.getInstance();
			
			Member member = new Member();
			member.setEmail(email);
			member.setPw(password);
			
			int successQueryNumber = memberDao.insertMemberInfo(member);
			
			if ( successQueryNumber == 1 )
				result = ThreeWayResult.SUCCESS;
			else
				result = ThreeWayResult.ALREADY_EXISTS;
		}
		logger.info("email : " + email);
		logger.info("password : "+ password);
		logger.info("result : "+result);
		
		resultJsonData.put(Constants.JSON_RESPONSE_3WAY_RESULT, result);
		out.println(gson.toJson(resultJsonData));
	}
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		logger.info("into doGet");
		
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		
		String newbieEmail = request.getParameter("email");
		
		MemberDaoImpl memberDao = MemberDaoImpl.getInstance();
		Member member = memberDao.selectDuplicateMemberExists(newbieEmail);
		boolean isExisted = false;
		
		if( member != null ) {
			if ( member.getId() != 0 )
				isExisted = true;
		}
		
		out.println(isExisted);
	}
}