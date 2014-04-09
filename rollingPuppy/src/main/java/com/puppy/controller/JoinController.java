	package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.puppy.dao.impl.MemberDaoImpl;
import com.puppy.dto.Member;

/*
 * 회원 정보들을 가지고 POST방식으로 들어오는 회원가입 요청을 처리하는 컨트롤러
 */

public class JoinController  extends HttpServlet {
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		
		MemberDaoImpl memberDao = new MemberDaoImpl();
		Member member = new Member();

		String email = request.getParameter("email");
		String password = request.getParameter("password");
		
		member.setEmail(email);
		member.setPw(password);
		
		out.println(memberDao.insertMemberInfo(member));
		response.sendRedirect("/");
	}
}