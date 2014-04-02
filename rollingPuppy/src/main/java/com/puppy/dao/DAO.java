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
	public List<?> selectList(Class<?> targetClass, String sql) {
		
		//반환할 데이터의 타입을 모르기때문에 GENERIC이 ?이다.
		List<?> lists = null;
		try {
			//데이터베이스 질의를 통해서 얻은 select결과데이터를 DTO객체에 담는 메소드
			lists = setReflectionDataToModel(targetClass , selectQuery(sql));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return lists;
	}
	
	/*
	 * 전달하는 SQL에 대한 한행의 결과데이터를 요청한다.
	 */
	public Object selectOne(Class<?> targetClass, String sql) {
		return selectList(targetClass, sql).get(0);
	}
	
	/*
	 * 인자로 전달받는 객체(DTO instance)에 sql결과물 (sqlResult)을 필드명에 맞게 (DTO instance의
	 * 변수명과 매칭되어야 한다) DTO Instance로 데이터를 담아주는 메소드 Reflection을 통해 구현되어있다.
	 * 결과적으로 각 DTO에 맞는 List를 리턴한다.
	 */
	public static List<Object> setReflectionDataToModel(Class<?> targetClass, List<LinkedHashMap<String, Object>> sqlResult)
																									throws IllegalAccessException, IllegalArgumentException,
																												InvocationTargetException, NoSuchMethodException,
																												SecurityException, InstantiationException {
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
	 * 
	 */
	//public boolean insertQuery

	/*
	 * 데이터베이스와의 커넥션을 통해 전달받는 Query를 수행. 
	 * 리턴되는 데이터는 Query결과물 전체를 List (전체행에 해당)에 LinkedHashMap (한행의 모든 열을 담은 맵)이 연결된 형태이다.
	 *  
	 * TODO Connection연결과 같은 부분들을 생성자 항목으로 이동시켜야 한다.
	 * TODO PrepareStatement로 변경해야 한다.
	 */
	public List<LinkedHashMap<String, Object>> selectQuery(String query) {
		Connection conn;
		Statement stmt;
		ResultSet rs;

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
			conn = DriverManager.getConnection(jdbcUrl, userID, userPW);
			System.out.println("Connection Success");

			stmt = conn.createStatement();
			rs = stmt.executeQuery(query);

			java.sql.ResultSetMetaData metaData = rs.getMetaData();
			int columnCount = metaData.getColumnCount();

			while (rs.next()) {
				LinkedHashMap<String, Object> columns = new LinkedHashMap<String, Object>();

				for (int i = 1; i <= columnCount; i++) {
					columns.put(metaData.getColumnLabel(i), rs.getObject(i));
				}
				rows.add(columns);
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			System.err.println("DB Error\n" + e);
		}
		return rows;
	}
}
