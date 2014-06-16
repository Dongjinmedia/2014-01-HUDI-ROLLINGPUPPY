package com.puppy.controller.member;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.puppy.controller.Controller;
import com.puppy.dao.impl.MemberDaoImpl;
import com.puppy.dto.Member;
import com.puppy.util.Constants;
import com.puppy.util.JsonParticipant;
import com.puppy.util.ServletRequestUtils;
import com.puppy.util.Util;

public class NicknameController implements Controller {

	private static final Logger logger = LoggerFactory.getLogger(NicknameController.class);
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.info("into doGet");
		
		int memberId = ServletRequestUtils.getIntParameter(request, Constants.REQUEST_MEMBER_ID);
		PrintWriter out = response.getWriter();
		Gson gson = new Gson();
		
		MemberDaoImpl memberDao = MemberDaoImpl.getInstance();
		
		Member member = new Member();
		member.setId(memberId);
		member = memberDao.selectNicknameFromMemberId(member);
		
		String nicknameAdjective = member.getNicknameAdjective();
		String nicknameNoun = member.getNicknameNoun();
		
		//악의적 접근
		//데이터없음
		if ( memberId == 0 || nicknameAdjective == null || nicknameNoun == null) {
			out.println(gson.toJson(null));
		} else {
			JsonParticipant returnData = new JsonParticipant (
					member.getNicknameAdjective(),
					member.getNicknameNoun(),
					Util.getHexBackgroundColorFromSeed(memberId),
					Util.getBackgroundImageUrlFromSeed(memberId)
			);
			out.println(gson.toJson(returnData));
		}
		
	}
	
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.sendRedirect("/error?type=404");
	}
}
