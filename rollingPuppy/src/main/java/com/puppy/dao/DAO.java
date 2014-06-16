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

import com.puppy.util.Util;

/*
 * Data Access Object
 * 데이터베이스와의 연결을 관장한다.
 * Any라는 키워드는 Generic에 대한 약속일뿐 예약어가 아니다.
 * 예를들어 <T> 나 원하는 값을 넣어서 사용할 수 있다.
 * 메소드에 등장하는 "protected <Any>"와 같은 형태는
 * 메소드 내에서 등장하는 Any에 대한 제네릭을 선언한것이다.
 */
public class DAO {

	protected DAO() {
	}
	
	private static final Logger logger = LoggerFactory.getLogger(DAO.class);
	
	/*
	 * 전달하는 SQL에 대한 여러행의 결과데이터를 요청한다.
	 */
	protected <Any> List<Any> selectList(Class<Any> targetClass, PreparedStatement preparedStatement) {
		logger.info("DAO selectList");

		//반환할 데이터의 타입을 모르기때문에 GENERIC이 ?이다.
		List<Any> lists = null;
		try {
			//데이터베이스 질의를 통해서 얻은 select결과데이터를 DTO객체에 담는 메소드
			lists = setReflectionDataToModel(targetClass , selectQuery(preparedStatement));
		} catch (Exception e) {
			logger.error("setReflectionDataToModel Exception" , e);
		}
		return lists;
	}

	/*
	 * 전달하는 SQL에 대한 한행의 결과데이터를 요청한다.
	 */
	protected <Any> Any selectOne(Class<Any> targetClass, PreparedStatement preparedStatement) {
		logger.info("DAO selectOne");
		
		List<Any> lists = selectList(targetClass, preparedStatement);
		return  ( lists == null || lists.isEmpty()  ? null : lists.get(0) );
	}
	
	/*
	 * 인자로 전달받는 객체(DTO instance)에 sql결과물 (sqlResult)을 필드명에 맞게 (DTO instance의
	 * 변수명과 매칭되어야 한다) DTO Instance로 데이터를 담아주는 메소드 Reflection을 통해 구현되어있다.
	 * 결과적으로 각 DTO에 맞는 List를 리턴한다.
	 */
	private static <Any> List<Any> setReflectionDataToModel(Class<Any> targetClass, List<Map<String, Object>> sqlResult)
																									throws Exception {
		logger.info("DAO setReflectionDataToModel");
		
		//전달받은 targetClass (DTO)에 선언된 모든 Field(변수)를 배열로 리턴한다.
		Field[] fields = targetClass.getDeclaredFields();
		
		//전달받은 targetClass (DTO)에 데이터를 담은후, 전달할 그릇을 선언한다.
		//List<Object>에서 Object는 targetClass에 해당하는 Instance이다.
		List<Any> instances = new ArrayList<Any>();

		//Query를 통해 리턴받는 리스트 (데이터베이스의 행)만큼을 수행한다.
		for (int i = 0; i < sqlResult.size(); ++i) {
			
			//targetClass의 객체를 생성한다.
			Any newInstance = targetClass.newInstance();
			
			//return할 List 그릇에 객체를 담는다. 
			instances.add(newInstance);
			
			//Query를 통해 리턴받은 리스트중 (데이터베이스의 행), 앞에서부터 순차적으로 한행씩 꺼낸다. 
			Map<String, Object> tuple = sqlResult.get(i);

			//targetClass(DTO)에 담긴 Field(변수)를 하나씩 돌면서 아래내용을 수행한다.
			for (Field field : fields) {
				//Field의 변수명을 가져온다.
				String fieldName = field.getName();
				
				
				//"행"에 해당하는 Map영역에서, 필드에 해당하는 항목의 데이터를 가져온다.
				Object sqlTargetData = tuple.get( Util.getUnderBarlConventionString(fieldName) ) ;
				
				//만약 필드에 해당하는 데이터가 null일경우, 다음필드로 넘어간다.
				if ( sqlTargetData == null)
					continue;
				
				/*
				//Test Print Code
				logger.info("fieldName : "+fieldName+" | fieldType : "+field.getType() + " | sqlTargetData :  "+sqlTargetData);
				
				if ( sqlTargetData.getClass() !=null 
					&& sqlTargetData.getClass().getFields() != null 
					&& sqlTargetData.getClass().getFields().length > 1 ) {
					logger.info(" | sqlTargetType : "+sqlTargetData.getClass().getFields()[0].getType());
				}
				*/
				
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
				method.invoke(newInstance, sqlTargetData ); // set메소드 호출.
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
	 * Like resultSet = preparedStatement.executeQuery(query);
	 */
	protected <Any> int insertQuery(PreparedStatement preparedStatement, Object targetClass) throws SQLException {
		logger.info("DAO insertQuery");
		
		int successQueryNumber = 0;
		Connection connection = null;
		ResultSet generatedKeys = null;
		
		try {
			//http://stackoverflow.com/questions/14016677/inserting-preparedstatement-to-database-psql
			//버그발견. 잘못이해해서 작성함. insert의 경우에는 execute()에서 항상 false를 리턴한다.
			//executeUpdate의 경우에는 insert에 성공한 column수를 리턴하게 된다.
			successQueryNumber = preparedStatement.executeUpdate();
			generatedKeys = preparedStatement.getGeneratedKeys();
			
			//TODO 리팩토링 필요. (현재 getInt(1)로 하드코딩 되어있음)
			if ( generatedKeys.next() ) {
				//클래스에 선언된 모든 메소드를 배열로 가져온다.
				Method[] methods = targetClass.getClass().getDeclaredMethods();
		        
				//setId의 존재유무를 확인한 flag
				boolean isMethodExist = false;
				Method targetMethod = null;
		        //루프를 돌면서 method이름에 setId라는 항목이 있는지 체크
		        for (Method method : methods) {
		            if ( method.getName().equalsIgnoreCase("setId") ) {
		            	isMethodExist = true;
		            	targetMethod = method;
		            }
		        }
		        
		        if ( isMethodExist ) {
		        	//메소드를 실제로 실행시켜준다.
					//setMethod(Paramter)를 실행시켜주는것!!
		        	//데이터베이스 첫번째 컬럼의 데이터를 가져와 저장한다.
					targetMethod.invoke(targetClass, generatedKeys.getInt(1)); // set메소드 호출.
		        }
		        
			}
			
		} catch (Exception e) {
			logger.error("Query [Execute or Close] Exception" , e);
		} finally {
			connection = preparedStatement.getConnection();
			
			if (connection != null) 
				connection.close();
			
			if ( preparedStatement != null) 
				preparedStatement.close();
			
			if ( generatedKeys != null )
				generatedKeys.close();
		}
		return successQueryNumber;
	}

	/*
	 * 데이터베이스와의 커넥션을 통해 전달받는 Query를 수행. 
	 * 리턴되는 데이터는 Query결과물 전체를 List (전체행에 해당)에 LinkedHashMap (한행의 모든 열을 담은 맵)이 연결된 형태이다.
	 *  
	 * TODO PrepareStatement로 변경해야 한다.
	 */
	private List<Map<String, Object>> selectQuery(PreparedStatement preparedStatement) throws SQLException {
		logger.info("DAO selectQuery");
		
		ResultSet resultSet = null;
		Connection connection = null;
		
		//LinkedHashMap은 순서가 보장되는 Map형태이다.
		//Query결과로 리턴되는 데이터베이스의 정보들은 순서가 보장되어야 하기때문에 LinkedHashMap을 사용했다.
		List<Map<String, Object>> rows = new ArrayList<Map<String, Object>>();

		try {
			//개개긱...ㅠㅠㅠㅠㅠㅠ
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
			
		} catch (Exception e) {
			logger.error("Query Select Error" , e);
		} finally {
			connection = preparedStatement.getConnection();
			if (resultSet != null)
				resultSet.close();
				
			if (connection != null) 
				connection.close();
			
			if ( preparedStatement != null) 
				preparedStatement.close();
		}
		return rows;
	}
	
	public int updateQuery(PreparedStatement preparedStatement) throws SQLException {
		logger.info("DAO updateQuery");
		
		int successQueryNumber = 0;
		Connection connection = null;
		
		try {
			successQueryNumber = preparedStatement.executeUpdate();
		} catch (Exception e) {
			logger.error("Query [Execute or Close] Exception" , e);
		} finally {
			connection = preparedStatement.getConnection();
			if (connection != null)  {
				connection.close();
			}
			
			if ( preparedStatement != null) {
				preparedStatement.close();
			}
		}
		
		return successQueryNumber;
	}
	
	public int deleteQuery(PreparedStatement preparedStatement) throws SQLException {
		logger.info("DAO deleteQuery");
		return updateQuery(preparedStatement);
	}
}
