package com.puppy.util;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

/*
 * XML을 일관적으로 분석하기위한 클래스.
 * 현재는 XPath를 이용하는 방법만이 제공된다.
 * 
 * 처음 클래스가 생성될때 생성자의 파라미터를 통해 XML파일을 read할 수 있도록 한후,
 * 해당 XML파일 객체를 재사용해서 데이터를 추출할 수 있도록 구현되어 있다.
 */
public class XMLReader {
	
	private Document document = null;
	private XPath xPath = null;
	
	private static final Logger logger = LoggerFactory.getLogger(XMLReader.class);
	
	public XMLReader(InputStream xmlStream) {
		initialize(xmlStream);
	}
	
	public XMLReader(URL xmlURL) {
		try {
			initialize(xmlURL.openStream());
		} catch (IOException e) {
			logger.error("XMLReader Parameter URL", e);
		}
	}
	
	private void initialize(InputStream xmlStream) {
		
		// Dom 오브젝트를 해석하기위해서는 DocumentBuilder 객체가 필요하다.
		// DocumentBuilder 객체를 만들기 위한 팩토리 클래스 선언
		DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();

		//XML해석을 위한 Document 객체를 선언. 이 객체는 ROOT엘리먼트를 대표한다.

		try {
			// XML 문서로부터 DOM Document 객체를 가져오기 위한 클래스 선언. DocumentBuidler클래스를
			// 이용해서
			// 프로그래머는 XML을 해석하기 위한 Document객체를 얻을 수 있다.
			DocumentBuilder builder = builderFactory.newDocumentBuilder();
			document = builder.parse(xmlStream);

			// document = builder.parse(new
			// FileInputStream("/Users/YOON-SUNG/Desktop/test.xml"));

		} catch (Exception e) {
			logger.error("XMLReader Initialize", e);
		}

		// Document객체까지 완성하면, XPath를 사용할 준비가 모두 완료된다.
		// XPath란 XML File에서부터 정보를 얻어내기 위해 사용하는 표준화된 언어이다.

		// REFERENCE
		// http://ko.wikipedia.org/wiki/XPath
		// http://www.nextree.co.kr/p6278/
		// 표현식 (expression)은 인터넷을 통해서 배우자.

		// XPathFactory를 통해 XPath 객체를 가져온다.
		xPath = XPathFactory.newInstance().newXPath();
	}
	
	public List<Map<String, Object>> getListFromXPath(String XPathExpression) {
		
		//리턴할 데이터
		List<Map<String, Object>> resultXmlList = new ArrayList<Map<String, Object>>(); 
		
		/*
		 * 각각의 검색결과값을 담고있는 리스트
		 */
		NodeList itemNodeList = null;
		try {
			//document에서 expression에 해당하는 데이터를 compile해서 리스트형태로 만든다.
			itemNodeList = (NodeList) xPath.compile(XPathExpression).evaluate(
					document, XPathConstants.NODESET);
		} catch (XPathExpressionException e) {
			System.err.println(e);
		}

		//추출한 nodeList 자료형에서 map형태의 list를 새로 만든다. 
		for (int i = 0; i < itemNodeList.getLength(); ++i) {
			
			//리턴할 데이터인 list에 담기위한 map선언
			Map<String, Object> resultXmlData = new HashMap<String ,Object>();
			
			//nodeList 중 for문에 해당하는 아이템을 가져온후
			//그 아이템의 첫번째자식노드를 가져온다.
			//그 노드를 target노드로 부른다.
			
			//Depth를 예로들어 표현하면 다음과 같다.
			//ex )
			//			-list레벨
			//				item
			//				...
			//				item
			//				item (for문에 해당하는 i번째 아이템)
			//					child (첫번째 자식노드)
			//					child
			//					child
			Node targetNode = itemNodeList.item(i).getFirstChild();
			
			// target노드가 null이 아닐경우, 아래내용을 계속 수행한다.
			while ( targetNode != null ) {
		
				//만약 targetNode의 자식노드가 존재할경우
				if ( targetNode.getFirstChild() != null ) {
					
					//map데이터에 노드정보를 담는다.
					resultXmlData.put
							(
									//ex) <nodeName>nodeValue</nodeName>
									targetNode.getNodeName(), 
									targetNode.getFirstChild().getNodeValue()
							);
				}
				
				//target노드를 같은레벨의 다음 node로 변경한다.
				targetNode = targetNode.getNextSibling();
			}
			
			//item에 해당하는 데이터에서 가져온 새로운 map을 return할 리스트에 담는다.
			resultXmlList.add(resultXmlData);
		}
		
		return resultXmlList;
	}
}
