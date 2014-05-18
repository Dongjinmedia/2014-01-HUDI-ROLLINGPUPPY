package com.puppy.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.google.gson.Gson;

public class SearchController implements Controller {
	
	private static final Logger logger = LoggerFactory.getLogger(SearchController.class);
	private static final String REQUEST_URL_FRONT = "http://openapi.naver.com/search?key=513cd098517cce82ec819f7862fb362f";
	private static final String REQUEST_URL_TAIL = "&target=local&start=1&display=10";
	
	//꼭 읽어야 할 레퍼런스 
	//http://ko.wikipedia.org/wiki/XPath
	//http://viralpatel.net/blogs/java-xml-xpath-tutorial-parse-xml/
	public List<Map<String, Object>> getDataFromXML(HttpServletRequest request, HttpServletResponse response,  URL requestURL ) throws IOException{
		
		List<Map<String, Object>> resultList = new ArrayList<Map<String,Object>>();
		//dom object 해석을 위해 documentBuilder 객체 필요
		//documentBuilder 객체를 만들기 위한 팩토리 클래스 선언
		DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
		
		//xml 해석을 위한 document 객체 선언
		//이 객체는 root element 대표
		//다른 packege의 document와의 차이점검색해볼것
		Document document = null;
		
		try{
			//DocumentBuilder클래스를 이용하여 xml 문서로부터 dom document 객체를 가져오기 위한 클래스 선언
			//결과적으로 프로그래머가 xml해석을 위한 document 객체를 얻을 수 있음.
			DocumentBuilder builder = builderFactory.newDocumentBuilder();
			
			//url로부터 xml을 읽어들이기 위한 inputStream 클래스 선언
			InputStream inputStream = requestURL.openStream();
			document = builder.parse(inputStream);
		} catch(Exception e){
			//System.err.println(e);
			logger.error("Search Controller documentBuildFactory Error :",e);
		}
		
		//System.out.println(document);
		
		//XPathFactory를 통해 XPath 객체를 가져옴
		XPath xPath = XPathFactory.newInstance().newXPath();
		
		/*
		 * 각각의 검색 결과 값을 담고 있는 리스트 
		 */
		
		NodeList itemNodeList = null;
		try {
			String expression = "/rss/channel/item";
			itemNodeList = (NodeList) xPath.compile(expression).evaluate(document, XPathConstants.NODESET);
		} catch (XPathExpressionException e) {
			logger.error("XPath error : ",e);
		}
		
		for(int i = 0 ; i< itemNodeList.getLength(); ++i){
			Map<String, Object> resultJsonData = new HashMap<String, Object>();
			
			Node targetNode = itemNodeList.item(i).getFirstChild();
			resultJsonData.put("storeName",targetNode.getFirstChild().getNodeValue());
			//logger.info("가게명 : " + targetNode.getFirstChild().getNodeValue());
			
			Node nextNode = targetNode.getNextSibling();
			
			if (nextNode != null)
				if ( nextNode.getFirstChild() != null) {
					resultJsonData.put("link",nextNode.getFirstChild().getNodeValue());
					//logger.info("링크 : "+nextNode.getFirstChild().getNodeValue());					
				}
			nextNode = nextNode.getNextSibling();
			if (nextNode != null)
				if ( nextNode.getFirstChild() != null) {
					resultJsonData.put("category",nextNode.getFirstChild().getNodeValue());
					//logger.info("카테고리 : "  + nextNode.getFirstChild().getNodeValue());
				}
			nextNode = nextNode.getNextSibling();
			if (nextNode != null)
				if ( nextNode.getFirstChild() != null){
					resultJsonData.put("explanation",nextNode.getFirstChild().getNodeValue());
					//logger.info("설명 : "  + nextNode.getFirstChild().getNodeValue());
				}
			
			nextNode = nextNode.getNextSibling();
			if (nextNode != null)
				if ( nextNode.getFirstChild() != null){			
					resultJsonData.put("phoneNumber",nextNode.getFirstChild().getNodeValue());
					//logger.info("전화번호 : "  + nextNode.getFirstChild().getNodeValue());
				}
			nextNode = nextNode.getNextSibling();
			if (nextNode != null)
		 		if ( nextNode.getFirstChild() != null){
					resultJsonData.put("address",nextNode.getFirstChild().getNodeValue());
					//logger.info("주소 : "  + nextNode.getFirstChild().getNodeValue());
		 		}
			nextNode = nextNode.getNextSibling();
			if (nextNode != null)
				if ( nextNode.getFirstChild() != null){
					//logger.info("도로명주소 : "  + nextNode.getFirstChild().getNodeValue());
					resultJsonData.put("roadAddress",nextNode.getFirstChild().getNodeValue());
				}
			nextNode = nextNode.getNextSibling();
			if (nextNode != null)
				if ( nextNode.getFirstChild() != null){
					resultJsonData.put("cartesianX",nextNode.getFirstChild().getNodeValue());
					//logger.info("카텍좌표계_X : "  + nextNode.getFirstChild().getNodeValue());
				}
			nextNode = nextNode.getNextSibling();
			if (nextNode != null)
				if ( nextNode.getFirstChild() != null){
					resultJsonData.put("cartesianY",nextNode.getFirstChild().getNodeValue());
					//logger.info("카텍좌표계_Y : "  + nextNode.getFirstChild().getNodeValue());
				}
			resultList.add(resultJsonData);
			//logger.info("\n=============================================\n\n\n");
		}
		return resultList;
	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		logger.info("indo doGet of Search Controller");
		
		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		List<Map<String, Object>> resultList = new ArrayList<Map<String,Object>>(); 
		Gson gson = new Gson();
		
		String searchKeyword = request.getParameter("searchKeyword");
		String requestURLString = REQUEST_URL_FRONT + "&query=" + searchKeyword +REQUEST_URL_TAIL;
		logger.info("requestURLString :" + requestURLString);
		URL requestURL = new URL(requestURLString);	
		resultList = getDataFromXML(request, response, requestURL);
		out.println(gson.toJson(resultList));
		logger.info(gson.toJson(resultList));
		
	}


	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		
	}
	
}
