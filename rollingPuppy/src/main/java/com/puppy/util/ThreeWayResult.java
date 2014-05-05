package com.puppy.util;

/*
 * Return 분류가 true, false 만으로 이루어지지 않는 항목들을 위한 enum 클래스이다.
 * ex) 로그인- 비밀번호 및 아이디 오류, 로그인성공, 예기치 못한 오류 등
 */
public enum ThreeWayResult {
		FAIL,
		SUCCESS,
		UNEXPECTED_ERROR,
		ALREADY_EXISTS
}
