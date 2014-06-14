package com.puppy.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.puppy.dao.impl.BookmarkDaoImpl;
import com.puppy.dao.impl.ChatInfoDaoImpl;
import com.puppy.dto.Bookmark;
import com.puppy.dto.ChatInfo;
import com.puppy.util.Constants;
import com.puppy.util.JsonChatInfo;
import com.puppy.util.ServletSessionUtils;
import com.puppy.util.UAgentInfo;
import com.puppy.util.Util;

/*
 * 로그인 이후 사용자가 머무는 유일한 페이지
 */
public class MainController implements Controller {
	
	//private static final Logger logger = LoggerFactory.getLogger(MainController.class);
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Gson gson = new Gson();
		
		// 세션 값이 없는 경우 index 페이지로 리다이렉트
		int userId = ServletSessionUtils.getIntParameter(request, Constants.SESSION_MEMBER_ID);
		
		if ( userId == 0 ) {
			response.sendRedirect("/");
			return;
		}
		
		RequestDispatcher view = null;
		if ( isThisRequestCommingFromAMobileDevice(request) ) {
			view = request.getRequestDispatcher("mobileMain.jsp");
			view.forward(request, response);
		} else {
			Map<String, JsonChatInfo> enteredChatInfoObject = getEnteredChatInfoObjectFromList(userId);
			List<Bookmark> bookmarkList = getBookmarkList(userId);
			
			request.setAttribute("enteredChatInfoObject", gson.toJson(enteredChatInfoObject));
			request.setAttribute("bookmarkList", gson.toJson(bookmarkList));
			
			view = request.getRequestDispatcher("main.jsp");
			view.forward(request, response); 
		}
		
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {}
	
	private boolean isThisRequestCommingFromAMobileDevice(HttpServletRequest request){

	    // http://www.hand-interactive.com/m/resources/detect-mobile-java.htm
	    String userAgent = request.getHeader("User-Agent");
	    String httpAccept = request.getHeader("Accept");

	    UAgentInfo detector = new UAgentInfo(userAgent, httpAccept);

	    if (detector.detectMobileQuick()) {
	        return true;
	    }

	    return false;
	}
	
	public Map<String, JsonChatInfo> getEnteredChatInfoObjectFromList(int userId) throws IOException {
		ChatInfoDaoImpl myChatInfoDaoImpl = ChatInfoDaoImpl.getInstance();
		List<ChatInfo> chatInfoList = myChatInfoDaoImpl.selectMyChatInfo(userId);
		
		/*
		 * chatInfoList를 이용해서 
		 * 다음과 같은 형태의 데이터를 만들 수 있도록 Util클래스에 요청한다. 
		 * 
		 * {
				"채팅방번호": {
					title: "",
					locationName: "", 
					max: "",
					unreadMessageNum: "",
					participantNum: "", 
					oParticipant: {
						"회원아이디": 
						{
							nickname: "",
						}
					}
				}
			} 
		 */
		return Util.getChatRoomInfoObjectFromQueryResult(chatInfoList);
	}

	public List<Bookmark> getBookmarkList(int userId) {
		BookmarkDaoImpl bookmarkDao = BookmarkDaoImpl.getInstance();
		return bookmarkDao.selectAllBookmark(userId);
	}
}
