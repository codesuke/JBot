package com.chatbot.exception;

public class RateLimitException extends RuntimeException {
    private final String model;
    private final int retryAfterSeconds;
    
    public RateLimitException(String model, int retryAfterSeconds) {
        super("Rate limit exceeded for model: " + model + ". Retry after " + retryAfterSeconds + " seconds.");
        this.model = model;
        this.retryAfterSeconds = retryAfterSeconds;
    }
    
    public String getModel() {
        return model;
    }
    
    public int getRetryAfterSeconds() {
        return retryAfterSeconds;
    }
}
