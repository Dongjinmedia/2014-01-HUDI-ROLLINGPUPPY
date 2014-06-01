package com.puppy.util;

public class JsonParticipant {
	@SuppressWarnings("unused")
	private String nicknameAdjective;
	
	@SuppressWarnings("unused")
	private String nicknameNoun;
	
	@SuppressWarnings("unused")
	private String backgroundColor;
	
	@SuppressWarnings("unused")
	private String backgroundImage;
	
	public JsonParticipant(String nicknameAdjective, String nicknameNoun, String backgroundColor, String backgroundImage) {
		this.nicknameAdjective = nicknameAdjective;
		this.nicknameNoun = nicknameNoun;
		this.backgroundColor = backgroundColor;
		this.backgroundImage = backgroundImage;
	}
}