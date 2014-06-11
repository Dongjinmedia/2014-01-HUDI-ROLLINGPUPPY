package com.puppy.dao.impl;

import java.sql.PreparedStatement;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.puppy.dao.BookmarkDao;
import com.puppy.dao.DAO;
import com.puppy.dto.Bookmark;

public class BookmarkDaoImpl extends DAO implements BookmarkDao{

	private static final Logger logger = LoggerFactory.getLogger(BookmarkDaoImpl.class);
	
	private static BookmarkDaoImpl instance;
	
	public static BookmarkDaoImpl getInstance() {
		return instance == null ? new BookmarkDaoImpl() : instance;
	};
	
	private BookmarkDaoImpl(){};
	
	@Override
	public int insertBookmark(Bookmark bookmark) {
		logger.info("InsertBookmark");
		
		PreparedStatement preparedStatement = null;
		int successQueryNumber = 0;
		
		try {
			String query = "INSERT INTO tbl_bookmark(member_id, bookmark_name, location_name, location_latitude, location_longitude) VALUES (?, ?, ?, ?, ?)";
			preparedStatement = ConnectionPool.getInsertPreparedStatement(query);
			preparedStatement.setInt(1, bookmark.getMemberId());
			preparedStatement.setString(2, bookmark.getBookmarkName());
			preparedStatement.setString(3, bookmark.getLocationName());
			preparedStatement.setFloat(4, bookmark.getLocationLatitude().floatValue());
			preparedStatement.setFloat(5, bookmark.getLocationLongitude().floatValue());
			
			successQueryNumber = insertQuery(preparedStatement, bookmark); 
		} catch (Exception e) {
			logger.error("in insertBookmark", e);
		}
		
		return successQueryNumber;
	}

	@Override
	public int deleteBookmark(Bookmark bookmark) {
		logger.info("deleteBookmark");
		
		PreparedStatement preparedStatement = null;
		int successQueryNumber = 0;
		
		try {
			String query = "DELETE FROM tbl_bookmark WHERE id = ? AND member_id = ?";
			preparedStatement = ConnectionPool.getInsertPreparedStatement(query);
			preparedStatement.setInt(1, bookmark.getId());
			preparedStatement.setInt(2, bookmark.getMemberId());
			
			successQueryNumber = deleteQuery(preparedStatement); 
		} catch (Exception e) {
			logger.error("in delteBookmark", e);
		}
		
		return successQueryNumber;
	}

	@Override
	public List<Bookmark> selectAllBookmark(int userId) {
		logger.info("selectBookmark");
		
		PreparedStatement preparedStatement = null;
		List<Bookmark> bookmarks = null;
		
		try {
			String query = "SELECT * FROM tbl_bookmark WHERE member_id = ?";
			preparedStatement = ConnectionPool.getInsertPreparedStatement(query);
			preparedStatement.setInt(1, userId);
			
			bookmarks = selectList(Bookmark.class, preparedStatement);
		} catch (Exception e) {
			logger.error("in delteBookmark", e);
		}
		
		return bookmarks;
	}
}
