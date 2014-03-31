package com.puppy.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.puppy.model.DAO;

public class JoinController  extends HttpServlet {
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		RequestDispatcher view = request.getRequestDispatcher("join.jsp");
		
		DAO dao = new DAO();
		System.out.println(dao.getConnectionResult());
		
		view.forward(request, response);
		//response.sendRedirect("/");
		//둘의 차이점을 반드시 이해할것!		
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	}
}
