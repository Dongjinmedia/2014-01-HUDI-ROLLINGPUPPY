	package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.dao.impl.MemberDaoImpl;
import com.puppy.dto.Member;
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
		
		MemberDaoImpl memberDao = MemberDaoImpl.getInstance();
		Member member = new Member();

		String email = Util.getStringValueFromPart( request.getPart("email"));
		String password = Util.getStringValueFromPart( request.getPart("password"));
		
		member.setEmail(email);
		member.setPw(password);
		
		//return true, false
		out.println(memberDao.insertMemberInfo(member));
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