package com.puppy.dao.impl;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;

public class ConnectionPool {
	/*
	 * Connection Pool로부터 Connection객체를 가져온다.
	 */
	private static final String jdbcDriver = "jdbc:apache:commons:dbcp:/com/puppy/pool/pool";
	private static Connection getConnection() throws SQLException {
		return DriverManager.getConnection(jdbcDriver);
	}
	
	static PreparedStatement getPreparedStatement(String sql) throws SQLException {
		return getConnection().prepareStatement(sql);
	}
	
	static PreparedStatement getInsertPreparedStatement(String sql) throws SQLException {
		return getConnection().prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
	}
}
