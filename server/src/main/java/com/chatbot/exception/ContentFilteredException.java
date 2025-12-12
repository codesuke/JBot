package com.chatbot.exception;

public class ContentFilteredException extends RuntimeException {
    private final String reason;
    
    public ContentFilteredException(String reason) {
        super("Content was filtered by safety settings: " + reason);
        this.reason = reason;
    }
    
    public String getReason() {
        return reason;
    }
}
