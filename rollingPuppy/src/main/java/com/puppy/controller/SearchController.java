package com.puppy.controller;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
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

@SuppressWarnings("serial")
public class SearchController extends HttpServlet{
	
	private static final Logger logger = LoggerFactory.getLogger(SearchController.class);
	//private static final String REAL_SERVER_KEY = "513cd098517cce82ec819f7862fb362f"; 
	private static final String DUMMY_KEY = "c1b406b32dbbbbeee5f2a36ddc14067f";
	private static final String REQUEST_URL = "http://openapi.naver.com/search?key="
			+ DUMMY_KEY
			+"&query=%EA%B0%88%EB%B9%84%EC%A7%91&target=local&start=1&display=100";
	
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		logger.info("into doGet");
		
		RequestDispatcher view = request.getRequestDispatcher("search.jsp");
		view.forward(request, response); 
	}
	
	
	//꼭 읽어야 할 레퍼런스 
	//http://ko.wikipedia.org/wiki/XPath
	//http://viralpatel.net/blogs/java-xml-xpath-tutorial-parse-xml/
	public void getDataFromXML(){
		
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
			URL url = new URL( REQUEST_URL);
			
			//url로부터 xml을 읽어들이기 위한 inputStream 클래스 선언
			InputStream inputStream = url.openStream();
			document = builder.parse(inputStream);
		} catch(Exception e){
			System.err.println(e);
		}
		
		System.out.println(document);
		
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
			System.err.println(e);
		}
		
		for(int i = 0 ; i< itemNodeList.getLength(); ++i){
			Node targetNode = itemNodeList.item(i).getFirstChild();
			System.out.println("가게명 :" + targetNode.getFirstChild().getNodeValue());
			
			Node nextNode = targetNode.getNextSibling();
			
			if (nextNode != null)
				if ( nextNode.getFirstChild() != null)
					System.out.println("링크 : "+nextNode.getFirstChild().getNodeValue());
			
			nextNode = nextNode.getNextSibling();
			if (nextNode != null)
				if ( nextNode.getFirstChild() != null)
					System.out.println("카테고리 : "  + nextNode.getFirstChild().getNodeValue());
			
			nextNode = nextNode.getNextSibling();
			if (nextNode != null)
				if ( nextNode.getFirstChild() != null)
					System.out.println("설명 : "  + nextNode.getFirstChild().getNodeValue());
			
			
			nextNode = nextNode.getNextSibling();
			if (nextNode != null)
				if ( nextNode.getFirstChild() != null)			
					System.out.println("전화번호 : "  + nextNode.getFirstChild().getNodeValue());
			
			nextNode = nextNode.getNextSibling();
			if (nextNode != null)
				if ( nextNode.getFirstChild() != null)
					System.out.println("주소 : "  + nextNode.getFirstChild().getNodeValue());
			
			nextNode = nextNode.getNextSibling();
			if (nextNode != null)
				if ( nextNode.getFirstChild() != null)
					System.out.println("카텍좌표계_X : "  + nextNode.getFirstChild().getNodeValue());
			
			nextNode = nextNode.getNextSibling();
			if (nextNode != null)
				if ( nextNode.getFirstChild() != null)
					System.out.println("카텍좌표계_Y : "  + nextNode.getFirstChild().getNodeValue());
			
			System.out.println("\n=============================================\n\n\n");
				
		}
		
		
	}
	
}
