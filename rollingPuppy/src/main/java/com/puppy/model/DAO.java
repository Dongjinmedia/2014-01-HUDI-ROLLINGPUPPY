package com.puppy.model;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;

public class DAO {
	public DAO() {
		System.out.println("connection request");
	}
	
	public String getConnectionResult() {
		Connection conn;
		Statement stmt;
		ResultSet rs;
		String sql;

		Gson gson = new Gson();
		
		String jdbcUrl = "jdbc:mysql://10.73.45.135/rolling_puppy";
		String userID = "root";
		String userPW = "dlrudals";

		List<Map<String, Object>> rows = new ArrayList<Map<String, Object>>();
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			System.err.println("Driver Error" + e.getMessage());
			e.printStackTrace();
		}
		System.out.println("Driver Loading Success");

		try {
			conn = DriverManager.getConnection(jdbcUrl, userID, userPW);
			System.out.println("Connection Success");
			stmt = conn.createStatement();
			rs = stmt.executeQuery("select * from tbl_member");
			
			System.out.println("rs = "+rs.toString());
			
			java.sql.ResultSetMetaData metaData = rs.getMetaData();
			int columnCount = metaData.getColumnCount();

			while (rs.next()) {
			    Map<String, Object> columns = new LinkedHashMap<String, Object>();

			    for (int i = 1; i <= columnCount; i++) {
			    	System.out.println("column label : "+metaData.getColumnLabel(i));
			    	System.out.println("getObject : "+ rs.getObject(i));
			        columns.put(metaData.getColumnLabel(i), rs.getObject(i));
			    }
			    rows.add(columns);
			}
			stmt.close();
			conn.close();
		} catch (SQLException e) {
			System.err.println("DB Error" + e.getMessage());
		}
		System.out.println(gson.toJson(rows));
		
		return gson.toJson(rows);
	}
}
