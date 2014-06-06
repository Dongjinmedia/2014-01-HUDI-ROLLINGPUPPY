package com.puppy.controller.chat;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.puppy.controller.Controller;
import com.puppy.dao.impl.NumOfParticipantDaoImpl;
import com.puppy.util.Constants;

public class NumOfParticipantController implements Controller {
	
	private static final Logger logger = LoggerFactory.getLogger(NumOfParticipantController.class);

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();

		int chatRoomId = Integer.parseInt(request.getParameter(Constants.REQUEST_CHATROOM_NUMBER));
		int numberOfParticipant = 0;
		
		try {
			NumOfParticipantDaoImpl numOfParcitipant = NumOfParticipantDaoImpl.getInstance();
			numberOfParticipant = numOfParcitipant.selectNumOfParticipant(chatRoomId);
			
		} catch (Exception e ) {
			logger.error("Request Get Current Number Of Participant With Chat Room ID", e);
		}
		
		out.println(gson.toJson(numberOfParticipant));
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {}
}