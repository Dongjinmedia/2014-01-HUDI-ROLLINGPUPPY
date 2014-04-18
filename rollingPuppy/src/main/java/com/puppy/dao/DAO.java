package com.puppy.dao;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/*
 * Data Access Object
 * 데이터베이스와의 연결을 관장한다.
 */
public class DAO {

	protected DAO() {}
	private static final Logger log = LoggerFactory.getLogger(DAO.class);
	
	/*
	 * 전달하는 SQL에 대한 여러행의 결과데이터를 요청한다.
	 */
	@SuppressWarnings("unchecked")
	protected <Any> Any selectList(Class<?> targetClass, PreparedStatement preparedStatement) {
		log.info("DAO selectList");

		//반환할 데이터의 타입을 모르기때문에 GENERIC이 ?이다.
		List<?> lists = null;
		try {
			//데이터베이스 질의를 통해서 얻은 select결과데이터를 DTO객체에 담는 메소드
			lists = setReflectionDataToModel(targetClass , selectQuery(preparedStatement));
		} catch (Exception e) {
			log.error("setReflectionDataToModel Exception" , e);
		}
		return (Any) lists;
	}

	/*
	 * 전달하는 SQL에 대한 한행의 결과데이터를 요청한다.
	 */
	@SuppressWarnings("unchecked")
	protected <Any> Any selectOne(Class<?> targetClass, PreparedStatement preparedStatement) {
		log.info("DAO selectOne");
		
		List<?> lists = selectList(targetClass, preparedStatement);
		return (Any) ( lists.isEmpty() || lists.size() == 0  ? null : lists.get(0) );
	}
	
	/*
	 * 인자로 전달받는 객체(DTO instance)에 sql결과물 (sqlResult)을 필드명에 맞게 (DTO instance의
	 * 변수명과 매칭되어야 한다) DTO Instance로 데이터를 담아주는 메소드 Reflection을 통해 구현되어있다.
	 * 결과적으로 각 DTO에 맞는 List를 리턴한다.
	 */
	private static List<Object> setReflectionDataToModel(Class<?> targetClass, List<Map<String, Object>> sqlResult)
																									throws Exception {
		log.info("DAO setReflectionDataToModel");
		
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
			Map<String, Object> sqlTargetResult = sqlResult.get(i);

			//targetClass(DTO)에 담긴 Field(변수)를 하나씩 돌면서 아래내용을 수행한다.
			for (Field field : fields) {
				//Field의 변수명을 가져온다.
				String fieldName = field.getName();
				
				//"행"에 해당하는 Map영역에서, 필드에 해당하는 항목의 데이터를 가져온다.
				Object sqlTargetData = sqlTargetResult.get(fieldName);
				
				//만약 필드에 해당하는 데이터가 null일경우, 다음필드로 넘어간다.
				if ( sqlTargetData == null)
					continue;
				
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
	 * TODO (?, ?, ?)와 같은 항목들을 이용할 수 있도록 리팩토링
	 * TODO PrepareStatement로 변경해야 한다.
	 * TODO 데이터입력의 성공여부를 정확하게 반환할 수 있어야 한다.
	 */
	protected boolean insertQuery(PreparedStatement preparedStatement) throws SQLException {
		log.info("DAO insertQuery");
		
		boolean isExecuteSuccess = false;
		Connection connection = null;
		
		try {
			
			//resultSet = preparedStatement.executeQuery(query);
			isExecuteSuccess = preparedStatement.execute();
			connection = preparedStatement.getConnection();
		} catch (Exception e) {
			log.error("Query [Execute or Close] Exception" , e);
		} finally {
			if (connection != null) connection.close();
			if ( preparedStatement != null) preparedStatement.close();
		}
		return isExecuteSuccess;
	}

	/*
	 * 데이터베이스와의 커넥션을 통해 전달받는 Query를 수행. 
	 * 리턴되는 데이터는 Query결과물 전체를 List (전체행에 해당)에 LinkedHashMap (한행의 모든 열을 담은 맵)이 연결된 형태이다.
	 *  
	 * TODO PrepareStatement로 변경해야 한다.
	 */
	private List<Map<String, Object>> selectQuery(PreparedStatement preparedStatement) throws SQLException {
		log.info("DAO selectQuery");
		
		ResultSet resultSet;
		Connection connection = null;
		
		//LinkedHashMap은 순서가 보장되는 Map형태이다.
		//Query결과로 리턴되는 데이터베이스의 정보들은 순서가 보장되어야 하기때문에 LinkedHashMap을 사용했다.
		List<Map<String, Object>> rows = new ArrayList<Map<String, Object>>();

		try {

			resultSet = preparedStatement.executeQuery();

			java.sql.ResultSetMetaData metaData = resultSet.getMetaData();
			int columnCount = metaData.getColumnCount();

			while (resultSet.next()) {
				Map<String, Object> columns = new HashMap<String, Object>();

				for (int i = 1; i <= columnCount; i++) {
					columns.put(metaData.getColumnLabel(i), resultSet.getObject(i));
				}
				rows.add(columns);
			}
			
			connection = preparedStatement.getConnection();
		} catch (Exception e) {
			log.error("Query Select Error" , e);
		} finally {
			if (connection != null) connection.close();
			if ( preparedStatement != null) preparedStatement.close();
		}
		return rows;
	}
}
