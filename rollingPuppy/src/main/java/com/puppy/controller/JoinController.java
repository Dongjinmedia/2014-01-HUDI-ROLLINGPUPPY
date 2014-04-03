	package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.puppy.dao.impl.MemberDaoImpl;
import com.puppy.dto.Member;

/*
 * 회원가입화면 (Get) 및 회원가입요청 (Post)에 대한 클래스
 */
public class JoinController  extends HttpServlet {
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		RequestDispatcher view = request.getRequestDispatcher("join.jsp");
		view.forward(request, response);
		//response.sendRedirect("/");
		//둘의 차이점을 반드시 이해할것!		
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		
		//Member클래스 데이터베이스 요청에 대한 객체생성
		MemberDaoImpl memberDao = new MemberDaoImpl();
		Member member = memberDao.selectDuplicateMemberExists(request.getParameter("email"));
		
		if ( member == null ) {
			out.println("member instance is Null!!");
		} else {
			if (member.getId()==0) {
				out.println("Email is Not Exists");	
			} else {
				out.println("Email is Already Exists");
			}
		}
		
	}
}