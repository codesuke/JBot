package com.chatbot.service;

import org.springframework.stereotype.Service;

@Service
public class TokenCountingService {
    
    // Approximate token count estimation
    // Real implementation would use tiktoken or similar library
    // For Gemini: ~4 characters ≈ 1 token
    public int estimateTokens(String text) {
        if (text == null || text.isEmpty()) {
            return 0;
        }
        
        // Basic estimation: count words and characters
        int charCount = text.length();
        int wordCount = text.split("\\s+").length;
        
        // Average between character-based and word-based estimation
        return (charCount / 4 + wordCount * 2) / 2;
    }
    
    public int estimateTokensForMessages(java.util.List<com.chatbot.entity.Message> messages) {
        return messages.stream()
                .mapToInt(msg -> estimateTokens(msg.getContent()))
                .sum();
    }
    
    // Gemini models typically have different context windows
    public int getModelContextWindow(String model) {
        if (model.contains("2.0")) {
            return 1000000; // Gemini 2.0 has 1M context window
        } else if (model.contains("1.5-pro")) {
            return 128000; // Gemini 1.5 Pro
        } else if (model.contains("1.5-flash")) {
            return 32000; // Gemini 1.5 Flash
        }
        return 30000; // Default safe limit
    }
    
    // Determine if we need to prune context
    public boolean shouldPruneContext(int currentTokens, String model) {
        int limit = getModelContextWindow(model);
        // Prune if we're at 80% capacity to leave room for response
        return currentTokens > (limit * 0.8);
    }
}
