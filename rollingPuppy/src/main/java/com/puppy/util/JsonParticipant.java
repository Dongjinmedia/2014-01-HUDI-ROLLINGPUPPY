package com.puppy.util;

public class JsonParticipant {
	private String nicknameAdjective;
	private String nicknameNoun;
	
	public JsonParticipant(String nicknameAdjective, String nicknameNoun) {
		this.nicknameAdjective = nicknameAdjective;
		this.nicknameNoun = nicknameNoun;
	}

	public String getNicknameAdjective() {
		return nicknameAdjective;
	}

	public String getNicknameNoun() {
		return nicknameNoun;
	}
}