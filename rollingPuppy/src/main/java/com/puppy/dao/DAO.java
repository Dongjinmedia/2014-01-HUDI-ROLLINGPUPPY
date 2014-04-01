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
	 * 인자로 전달받는 객체(DTO instance)에 sql결과물 (sqlResult)을 필드명에 맞게 (DTO instance의
	 * 변수명과 매칭되어야 한다) DTO Instance로 데이터를 담아주는 메소드 Reflection을 통해 구현되어있다.
	 * 결과적으로 각 DTO에 맞는 List를 리턴한다.
	 */
	public static List<Object> setReflectionDataToModel(Class<?> targetClass, List<LinkedHashMap<String, Object>> sqlResult)
																									throws IllegalAccessException, IllegalArgumentException,
																												InvocationTargetException, NoSuchMethodException,
																												SecurityException, InstantiationException {
		//Class<?> targetClass = instance.getClass(); // Class로 형변환
		Field[] fields = targetClass.getDeclaredFields(); // 선언된 모든 변수명을 Field 배열로 리턴
		List<Object> instances = new ArrayList<Object>();

		for (int i = 0; i < sqlResult.size(); ++i) {
			Object newInstance = targetClass.newInstance();
			instances.add(newInstance);

			LinkedHashMap<String, Object> sqlTargetResult = sqlResult.get(i);

			for (Field field : fields) { // for문을 돌면서 하나씩 가져오기
				String fieldName = field.getName(); // 변수명가져오기
				System.out.println(fieldName);

				Method method = targetClass.getMethod(
						"set" + fieldName.substring(0, 1).toUpperCase()
						+ fieldName.substring(1), new Class[] { field.getType() }); // setTest와 같이 메소드명 가져오기

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
	 * 데이터베이스와의 커넥션을 통해 전달받는 Query를 수행. 리턴되는 데이터는 Query결과물 전체를 List (전체행에 해당)에
	 * LinkedHashMap (한행의 모든 열을 담은 맵)이 연결된 형태이다. TODO Connection연결과 같은 부분들을 생성자
	 * 항목으로 이동시켜야 한다.
	 */
	public List<LinkedHashMap<String, Object>> selectQuery(String query) {
		Connection conn;
		Statement stmt;
		ResultSet rs;

		String jdbcUrl = "jdbc:mysql://10.73.45.135/rolling_puppy";
		String userID = "root";
		String userPW = "dlrudals";

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

			System.out.println("rs = " + rs.toString());

			java.sql.ResultSetMetaData metaData = rs.getMetaData();
			int columnCount = metaData.getColumnCount();

			while (rs.next()) {
				LinkedHashMap<String, Object> columns = new LinkedHashMap<String, Object>();

				for (int i = 1; i <= columnCount; i++) {
					// System.out.println("column label : "+metaData.getColumnLabel(i));
					// System.out.println("getObject : "+ rs.getObject(i));
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
