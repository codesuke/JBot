package com.chatbot.service;

import com.chatbot.exception.AIServiceException;
import com.chatbot.exception.ContentFilteredException;
import com.chatbot.exception.RateLimitException;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiService {
    
    @Value("${gemini.api-key}")
    private String apiKey;
    
    @Value("${gemini.model}")
    private String modelName;
    
    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(5, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .writeTimeout(10, TimeUnit.SECONDS)
            .build();
    private final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    
    // Try multiple model endpoints in order of preference
    // Using Google's current model names (Dec 2025)
    private static final String[] SUPPORTED_MODELS = {
        "gemini-2.0-flash",             // Primary - stable 2.0 flash
        "gemini-2.0-flash-001",          // Specific version fallback
        "gemini-2.5-flash"               // Latest model if available
    };
    
    public String generateResponse(String prompt, String model) {
        String modelToUse = (model != null && !model.isEmpty()) ? model : modelName;
        
        // Try to use the requested model first
        GeminiResult result = tryCallGemini(prompt, modelToUse, 0);
        if (result.isSuccess()) {
            return result.getResponse();
        }
        
        // Check if error is fatal (non-retryable)
        if (result.isFatalError()) {
            log.error("Fatal error with model {}: {}", modelToUse, result.getErrorMessage());
            throw new AIServiceException(result.getErrorMessage(), result.getErrorCode(), false);
        }
        
        // Check for rate limit
        if (result.isRateLimit()) {
            throw new RateLimitException(modelToUse, result.getRetryAfter());
        }
        
        // Check for content filtering
        if (result.isContentFiltered()) {
            throw new ContentFilteredException(result.getErrorMessage());
        }
        
        // If that fails with retryable error, try fallback models with backoff
        log.warn("Model {} failed ({}), trying fallback models", modelToUse, result.getErrorMessage());
        int attempts = 0;
        for (String fallbackModel : SUPPORTED_MODELS) {
            if (!fallbackModel.equals(modelToUse)) {
                attempts++;
                if (attempts > 3) {
                    log.warn("Circuit breaker: stopping after 3 failed attempts");
                    break;
                }
                
                // Exponential backoff: wait before trying next model
                if (attempts > 1) {
                    int delayMs = (int) Math.pow(2, attempts - 1) * 500; // 500ms, 1s, 2s
                    log.info("Waiting {}ms before trying next model", delayMs);
                    try {
                        Thread.sleep(delayMs);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
                
                log.info("Trying fallback model: {} (attempt {})", fallbackModel, attempts);
                result = tryCallGemini(prompt, fallbackModel, attempts);
                if (result.isSuccess()) {
                    log.info("Success with fallback model: {}", fallbackModel);
                    return result.getResponse();
                }
                
                if (result.isFatalError() || result.isContentFiltered()) {
                    log.error("Non-retryable error during fallback: {}", result.getErrorMessage());
                    break;
                }
            }
        }
        
        // All attempts failed
        throw new AIServiceException(
            "All AI models are currently unavailable. Please try again later.",
            "ALL_MODELS_FAILED",
            true
        );
    }
    
    private GeminiResult tryCallGemini(String prompt, String model, int attemptNumber) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1/models/" + model + ":generateContent?key=" + apiKey;
            
            log.debug("Calling Gemini API with model: {}", model);
            
            // Build request body
            JsonObject requestBody = new JsonObject();
            JsonObject content = new JsonObject();
            JsonObject parts = new JsonObject();
            parts.addProperty("text", prompt);
            
            JsonArray partsArray = new JsonArray();
            partsArray.add(parts);
            content.add("parts", partsArray);
            
            JsonArray contentsArray = new JsonArray();
            contentsArray.add(content);
            requestBody.add("contents", contentsArray);
            
            RequestBody body = RequestBody.create(requestBody.toString(), JSON);
            
            Request request = new Request.Builder()
                    .url(url)
                    .post(body)
                    .build();
            
            try (Response response = httpClient.newCall(request).execute()) {
                int statusCode = response.code();
                
                if (!response.isSuccessful()) {
                    String errorBody = response.body() != null ? response.body().string() : "No error details";
                    log.warn("Model {} returned error {}: {}", model, statusCode, errorBody);
                    
                    // Classify errors
                    if (statusCode == 429) {
                        // Rate limit - calculate retry after
                        int retryAfter = 60; // Default to 60 seconds
                        String retryAfterHeader = response.header("Retry-After");
                        if (retryAfterHeader != null) {
                            try {
                                retryAfter = Integer.parseInt(retryAfterHeader);
                            } catch (NumberFormatException e) {
                                // Keep default
                            }
                        }
                        return GeminiResult.rateLimit(model, retryAfter);
                    } else if (statusCode == 400 || statusCode == 401 || statusCode == 403 || statusCode == 404) {
                        // Fatal errors
                        String errorCode = statusCode == 401 || statusCode == 403 ? "AUTH_ERROR" : "INVALID_REQUEST";
                        return GeminiResult.fatalFailure("HTTP " + statusCode + ": " + errorBody, errorCode);
                    } else {
                        // Retryable errors (500, 503, etc.)
                        return GeminiResult.retryableFailure("HTTP " + statusCode + ": " + errorBody);
                    }
                }
                
                String responseBody = response.body().string();
                JsonObject jsonResponse = JsonParser.parseString(responseBody).getAsJsonObject();
                
                // Safe JSON parsing with null checks
                if (!jsonResponse.has("candidates")) {
                    return GeminiResult.failure("No candidates in response", false, false, 0);
                }
                
                JsonArray candidates = jsonResponse.getAsJsonArray("candidates");
                if (candidates.size() == 0) {
                    return GeminiResult.failure("Empty candidates array (possibly filtered by safety)", false, false, 0);
                }
                
                JsonObject candidate = candidates.get(0).getAsJsonObject();
                if (!candidate.has("content")) {
                    return GeminiResult.failure("No content in candidate", false, false, 0);
                }
                
                JsonObject contentObj = candidate.getAsJsonObject("content");
                if (!contentObj.has("parts")) {
                    return GeminiResult.failure("No parts in content", false, false, 0);
                }
                
                JsonArray partsArr = contentObj.getAsJsonArray("parts");
                if (partsArr.size() == 0) {
                    return GeminiResult.failure("Empty parts array", false, false, 0);
                }
                
                JsonObject part = partsArr.get(0).getAsJsonObject();
                if (!part.has("text")) {
                    return GeminiResult.failure("No text in part", false, false, 0);
                }
                
                String aiResponse = part.get("text").getAsString();
                log.info("Successfully got response from model: {}", model);
                return GeminiResult.success(aiResponse);
            }
        } catch (Exception e) {
            log.debug("Error calling model {}: {}", model, e.getMessage());
            return GeminiResult.failure("Exception: " + e.getMessage(), false, false, 0);
        }
    }
    
    // Inner class to represent result with error classification
    private static class GeminiResult {
        private final boolean success;
        private final String response;
        private final String errorMessage;
        private final String errorCode;
        private final boolean fatalError;
        private final boolean rateLimit;
        private final boolean contentFiltered;
        private final int retryAfter;
        
        private GeminiResult(boolean success, String response, String errorMessage, String errorCode,
                            boolean fatalError, boolean rateLimit, boolean contentFiltered, int retryAfter) {
            this.success = success;
            this.response = response;
            this.errorMessage = errorMessage;
            this.errorCode = errorCode;
            this.fatalError = fatalError;
            this.rateLimit = rateLimit;
            this.contentFiltered = contentFiltered;
            this.retryAfter = retryAfter;
        }
        
        static GeminiResult success(String response) {
            return new GeminiResult(true, response, null, null, false, false, false, 0);
        }
        
        static GeminiResult fatalFailure(String errorMessage, String errorCode) {
            return new GeminiResult(false, null, errorMessage, errorCode, true, false, false, 0);
        }
        
        static GeminiResult retryableFailure(String errorMessage) {
            return new GeminiResult(false, null, errorMessage, "SERVICE_ERROR", false, false, false, 0);
        }
        
        static GeminiResult rateLimit(String model, int retryAfter) {
            return new GeminiResult(false, null, "Rate limit for " + model, "RATE_LIMIT", false, true, false, retryAfter);
        }
        
        static GeminiResult contentFiltered(String reason) {
            return new GeminiResult(false, null, reason, "CONTENT_FILTERED", false, false, true, 0);
        }
        
        static GeminiResult failure(String errorMessage, boolean rateLimit, boolean contentFiltered, int retryAfter) {
            return new GeminiResult(false, null, errorMessage, "ERROR", false, rateLimit, contentFiltered, retryAfter);
        }
        
        boolean isSuccess() {
            return success;
        }
        
        String getResponse() {
            return response;
        }
        
        String getErrorMessage() {
            return errorMessage;
        }
        
        String getErrorCode() {
            return errorCode;
        }
        
        boolean isFatalError() {
            return fatalError;
        }
        
        boolean isRateLimit() {
            return rateLimit;
        }
        
        boolean isContentFiltered() {
            return contentFiltered;
        }
        
        int getRetryAfter() {
            return retryAfter;
        }
    }
}
