package com.puppy.dao.impl;

import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class ConnectionPool {
	/*
	 * Connection Pool로부터 Connection객체를 가져온다.
	 */
	static PreparedStatement getPreparedStatement(String sql) throws SQLException {
		String jdbcDriver = "jdbc:apache:commons:dbcp:/com/puppy/pool/pool";
		return DriverManager.getConnection(jdbcDriver).prepareStatement(sql);
	}
}
