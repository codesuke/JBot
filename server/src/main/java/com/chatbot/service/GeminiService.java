package com.chatbot.service;

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

@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiService {
    
    @Value("${gemini.api-key}")
    private String apiKey;
    
    @Value("${gemini.model}")
    private String modelName;
    
    private final OkHttpClient httpClient = new OkHttpClient();
    private final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    
    // Try multiple model endpoints in order of preference
    private static final String[] SUPPORTED_MODELS = {
        "gemini-2.5-pro",      // Latest
        "gemini-2.5-flash",    // Latest flash
        "gemini-2.0-pro",      // Older pro
        "gemini-2.0-flash",    // Older flash
        "gemini-1.5-pro",      // Even older
        "gemini-1.5-flash",    // Even older
        "gemini-pro"           // Fallback
    };
    
    public String generateResponse(String prompt, String model) {
        try {
            String modelToUse = (model != null && !model.isEmpty()) ? model : modelName;
            
            // Try to use the requested model first
            String response = tryCallGemini(prompt, modelToUse);
            if (response != null && !response.contains("Sorry, I encountered")) {
                return response;
            }
            
            // If that fails, try other supported models
            log.warn("Model {} failed, trying fallback models", modelToUse);
            for (String fallbackModel : SUPPORTED_MODELS) {
                if (!fallbackModel.equals(modelToUse)) {
                    log.info("Trying fallback model: {}", fallbackModel);
                    response = tryCallGemini(prompt, fallbackModel);
                    if (response != null && !response.contains("Sorry, I encountered")) {
                        log.info("Success with model: {}", fallbackModel);
                        return response;
                    }
                }
            }
            
            // All models failed
            return "Sorry, all AI models are currently unavailable. Please try again later.";
            
        } catch (Exception e) {
            log.error("Error in generateResponse: {}", e.getMessage(), e);
            return "Sorry, I encountered an unexpected error. Please try again.";
        }
    }
    
    private String tryCallGemini(String prompt, String model) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;
            
            log.debug("Calling Gemini API with model: {}", model);
            
            // Build request body
            JsonObject requestBody = new JsonObject();
            JsonObject content = new JsonObject();
            JsonObject parts = new JsonObject();
            parts.addProperty("text", prompt);
            
            com.google.gson.JsonArray partsArray = new com.google.gson.JsonArray();
            partsArray.add(parts);
            content.add("parts", partsArray);
            
            com.google.gson.JsonArray contentsArray = new com.google.gson.JsonArray();
            contentsArray.add(content);
            requestBody.add("contents", contentsArray);
            
            RequestBody body = RequestBody.create(requestBody.toString(), JSON);
            
            Request request = new Request.Builder()
                    .url(url)
                    .post(body)
                    .build();
            
            try (Response response = httpClient.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    String errorBody = response.body() != null ? response.body().string() : "No error details";
                    log.warn("Model {} returned error {}: {}", model, response.code(), errorBody);
                    return null; // Try next model
                }
                
                String responseBody = response.body().string();
                JsonObject jsonResponse = JsonParser.parseString(responseBody).getAsJsonObject();
                
                String aiResponse = jsonResponse
                        .getAsJsonArray("candidates")
                        .get(0)
                        .getAsJsonObject()
                        .getAsJsonObject("content")
                        .getAsJsonArray("parts")
                        .get(0)
                        .getAsJsonObject()
                        .get("text")
                        .getAsString();
                
                log.info("Successfully got response from model: {}", model);
                return aiResponse;
            }
        } catch (Exception e) {
            log.debug("Error calling model {}: {}", model, e.getMessage());
            return null; // Try next model
        }
    }
}
