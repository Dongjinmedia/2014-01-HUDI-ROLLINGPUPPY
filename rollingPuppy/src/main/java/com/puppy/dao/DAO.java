package com.puppy.dao;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import javax.swing.text.html.HTMLDocument.HTMLReader.PreAction;
import java.sql.PreparedStatement;

/*
 * Data Access Object
 * 데이터베이스와의 연결을 관장한다.
 */
public class DAO {

	/*
	 * TODO 초기화과정에서만 Connection 맺도록 변경되어야 한다.
	 */
	protected DAO() {
		System.out.println("connection request");
	}

	/*
	 * 전달하는 SQL에 대한 여러행의 결과데이터를 요청한다.
	 */
	@SuppressWarnings("unchecked")
	protected <Any> Any selectList(Class<?> targetClass, String sql) {
		
		//반환할 데이터의 타입을 모르기때문에 GENERIC이 ?이다.
		List<?> lists = null;
		try {
			//데이터베이스 질의를 통해서 얻은 select결과데이터를 DTO객체에 담는 메소드
			lists = setReflectionDataToModel(targetClass , selectQuery(sql));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return (Any) lists;
	}

	/*
	 * 전달하는 SQL에 대한 한행의 결과데이터를 요청한다.
	 */
	@SuppressWarnings("unchecked")
	protected <Any> Any selectOne(Class<?> targetClass, String sql) {
		List<?> lists = selectList(targetClass, sql);
		return (Any) ( lists == null || lists.size() == 0  ? null : lists.get(0) );
	}
	
	/*
	 * 인자로 전달받는 객체(DTO instance)에 sql결과물 (sqlResult)을 필드명에 맞게 (DTO instance의
	 * 변수명과 매칭되어야 한다) DTO Instance로 데이터를 담아주는 메소드 Reflection을 통해 구현되어있다.
	 * 결과적으로 각 DTO에 맞는 List를 리턴한다.
	 */
	private static List<Object> setReflectionDataToModel(Class<?> targetClass, List<LinkedHashMap<String, Object>> sqlResult)
																									throws Exception {
		//전달받은 targetClass (DTO)에 선언된 모든 Field(변수)를 배열로 리턴한다.
		Field[] fields = targetClass.getDeclaredFields();
		
		//전달받은 targetClass (DTO)에 데이터를 담은후, 전달할 그릇을 선언한다.
		//List<Object>에서 Object는 targetClass에 해당하는 Instance이다.
		List<Object> instances = new ArrayList<Object>();

		//Query를 통해 리턴받는 리스트 (데이터베이스의 행)만큼을 수행한다.
		for (int i = 0; i < sqlResult.size(); ++i) {
			
			//targetClass의 객체를 생성한다.
			Object newInstance = targetClass.newInstance();
			
			//return할 List 그릇에 객체를 담는다. 
			instances.add(newInstance);
			
			//Query를 통해 리턴받은 리스트중 (데이터베이스의 행), 앞에서부터 순차적으로 한행씩 꺼낸다. 
			LinkedHashMap<String, Object> sqlTargetResult = sqlResult.get(i);

			//targetClass(DTO)에 담긴 Field(변수)를 하나씩 돌면서 아래내용을 수행한다.
			for (Field field : fields) {
				//Field의 변수명을 가져온다.
				String fieldName = field.getName();
				
				//targetClass(DTO)에 담긴 모든 method(함수)중에서, "set메소드명"해당하는 Method객체를 가져온다.
				//Parameter는
				//1. 메소드명  
				//2. 메소드의 전달인자 (DTO에 선언된 메소드의 실제 전달인자)
				Method method = targetClass.getMethod (
						//메소드명 만들기
						//ex) setMethod
						"set" + fieldName.substring(0, 1).toUpperCase()
						+ fieldName.substring(1),
						
						//메소드의 파라미터 Type가져오기
						new Class[] { field.getType() }
				);
				
				//메소드를 실제로 실행시켜준다.
				//setMethod(Paramter)를 실행시켜주는것!!
				method.invoke(newInstance, sqlTargetResult.get(fieldName)); // set메소드 호출.
			}
		}
		
		return instances;
	}

	/*
	 * 데이터베이스와의 커넥션을 통해 전달받는 Query를 수행. 
	 * 리턴되는 데이터는 Query 실행에 대한 성공여부이다.
	 *  
	 * TODO Connection연결과 같은 부분들을 생성자 항목으로 이동시켜야 한다.
	 * TODO (?, ?, ?)와 같은 항목들을 이용할 수 있도록 리팩토링
	 * TODO PrepareStatement로 변경해야 한다.
	 */
	private boolean insertQuery(String query) {
		
		//TODO 중복코드 제거
		Connection connection = null;
		PreparedStatement preparedStatement = null;
		ResultSet resultSet = null;
		
		boolean executeResult = false;
		
		/*
		 * TODO 하단의 정보들은 은닉화, XML화 되어야 한다.
		 * 	TODO 중복코드 제거
		 */
		String jdbcUrl = "jdbc:mysql://10.73.45.135/rolling_puppy";
		String userID = "root";
		String userPW = "dlrudals";
		
		//TODO 중복코드 제거
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			System.err.println("Driver Error\n" + e);
			return executeResult;
		}
		System.out.println("Driver Loading Success");
		
		//TODO 중복코드 제거
		try {
			connection = DriverManager.getConnection(jdbcUrl, userID, userPW);
			System.out.println("Connection Success");

			preparedStatement = connection.prepareStatement(query);
			resultSet = preparedStatement.executeQuery(query);

			preparedStatement.execute();
			
			preparedStatement.close();
			connection.close();
		} catch (SQLException e) {
			System.err.println("DB Error\n" + e);
			return executeResult;
		} 
		
		return executeResult;
	}

	/*
	 * 데이터베이스와의 커넥션을 통해 전달받는 Query를 수행. 
	 * 리턴되는 데이터는 Query결과물 전체를 List (전체행에 해당)에 LinkedHashMap (한행의 모든 열을 담은 맵)이 연결된 형태이다.
	 *  
	 * TODO Connection연결과 같은 부분들을 생성자 항목으로 이동시켜야 한다.
	 * TODO PrepareStatement로 변경해야 한다.
	 */
	private List<LinkedHashMap<String, Object>> selectQuery(String query) {
		Connection connection;
		Statement statement;
		ResultSet resultSet;

		/*
		 * TODO 하단의 정보들은 은닉화, XML화 되어야 한다.
		 */
		String jdbcUrl = "jdbc:mysql://10.73.45.135/rolling_puppy";
		String userID = "root";
		String userPW = "dlrudals";

		//LinkedHashMap은 순서가 보장되는 Map형태이다.
		//Query결과로 리턴되는 데이터베이스의 정보들은 순서가 보장되어야 하기때문에 LinkedHashMap을 사용했다.
		List<LinkedHashMap<String, Object>> rows = new ArrayList<LinkedHashMap<String, Object>>();

		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			System.err.println("Driver Error\n" + e);
		}
		System.out.println("Driver Loading Success");

		try {
			connection = DriverManager.getConnection(jdbcUrl, userID, userPW);
			System.out.println("Connection Success");

			statement = connection.createStatement();
			resultSet = statement.executeQuery(query);

			java.sql.ResultSetMetaData metaData = resultSet.getMetaData();
			int columnCount = metaData.getColumnCount();

			while (resultSet.next()) {
				LinkedHashMap<String, Object> columns = new LinkedHashMap<String, Object>();

				for (int i = 1; i <= columnCount; i++) {
					columns.put(metaData.getColumnLabel(i), resultSet.getObject(i));
				}
				rows.add(columns);
			}
			statement.close();
			connection.close();
		} catch (SQLException e) {
			System.err.println("DB Error\n" + e);
		}
		return rows;
	}
}
