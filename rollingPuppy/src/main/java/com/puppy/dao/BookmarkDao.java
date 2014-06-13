package com.puppy.dao;

import java.util.List;

import com.puppy.dto.Bookmark;

public interface BookmarkDao {
	public List<Bookmark> selectAllBookmark(int userId);
	public int insertBookmark(Bookmark bookmark);
	public int deleteBookmark(Bookmark bookmark);
}
