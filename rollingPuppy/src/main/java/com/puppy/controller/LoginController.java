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

public class LoginController extends HttpServlet {
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		RequestDispatcher view = request.getRequestDispatcher("login.jsp");
		view.forward(request, response); //login 이라고만 써도 login.jsp를 띄워준
		//response.sendRedirect("/"); //정확한 경로를 써야해. jsp처럼
		//둘의 차이점을 반드시 이해할것!		
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		String email = request.getParameter("email");
		String pw = request.getParameter("pw");
		
		PrintWriter out = response.getWriter(); //웹페이지에 띄우는 것 
		
		MemberDaoImpl memberDao = new MemberDaoImpl();
		Member member = memberDao.selectCheckLoginInfo(email, pw);
		
		if(member == null){
			out.println("member instance is Null!!");
		} else {
			if ( member.getId() == 0 ) {
				out.println("Email and password are not matched");
			} else {
				out.println("login success");
			}
		}
		
	}

}
