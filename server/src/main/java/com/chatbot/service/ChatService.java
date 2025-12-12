package com.chatbot.service;

import com.chatbot.dto.ChatRequest;
import com.chatbot.dto.ChatResponse;
import com.chatbot.entity.Message;
import com.chatbot.entity.MessageRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {
    
    private final GeminiService geminiService;
    private final TokenCountingService tokenCountingService;
    private final Map<String, List<Message>> conversations = new ConcurrentHashMap<>();
    private final AtomicLong messageIdCounter = new AtomicLong(0);
    
    // Context window limits
    private static final int MAX_MESSAGES_IN_CONTEXT = 20; // Keep last 20 messages
    private static final int MAX_MESSAGES_TO_KEEP = 20; // Keep last 20 messages for pruning
    private static final int ESTIMATED_TOKENS_PER_MESSAGE = 150; // Average tokens per message
    private static final int MAX_TOTAL_TOKENS = 25000; // Leave buffer for response
    
    public ChatResponse sendMessage(ChatRequest request) {
        // Store user message first
        Message userMessage = Message.builder()
                .id(messageIdCounter.incrementAndGet())
                .userId(request.getUserId())
                .content(request.getContent())
                .role(MessageRole.USER)
                .model(request.getModel())
                .createdAt(LocalDateTime.now())
                .build();
        
        List<Message> userConversation = conversations.computeIfAbsent(request.getUserId(), k -> new ArrayList<>());
        userConversation.add(userMessage);
        
        // Prune conversation to maintain context window
        pruneConversation(request.getUserId());
        
        // Build context from recent messages for better AI responses
        String contextualPrompt = buildContextualPrompt(request.getUserId(), request.getContent());
        
        // Generate response from Gemini
        String aiResponse = geminiService.generateResponse(contextualPrompt, request.getModel());
        
        // Calculate token usage
        int responseTokens = tokenCountingService.estimateTokens(aiResponse);
        
        // Create assistant message
        Message assistantMessage = Message.builder()
                .id(messageIdCounter.incrementAndGet())
                .userId(request.getUserId())
                .content(aiResponse)
                .role(MessageRole.ASSISTANT)
                .model(request.getModel())
                .tokens((double) responseTokens)
                .createdAt(LocalDateTime.now())
                .build();
        
        // Store in memory
        userConversation.add(assistantMessage);
        
        return ChatResponse.fromMessage(assistantMessage);
    }
    
    private void pruneContextIfNeeded(List<Message> messages, String model) {
        // Check if we need to prune based on token count
        int totalTokens = tokenCountingService.estimateTokensForMessages(messages);
        
        if (tokenCountingService.shouldPruneContext(totalTokens, model)) {
            // Keep only the most recent messages
            int toRemove = Math.max(0, messages.size() - MAX_MESSAGES_TO_KEEP);
            if (toRemove > 0) {
                messages.subList(0, toRemove).clear();
            }
        }
    }
    
    private String buildContextPrompt(List<Message> messages, String currentPrompt) {
        // For now, just return the current prompt
        // In a more sophisticated implementation, you could include recent context
        // Format: "Previous context: [last few messages]\n\nCurrent question: {currentPrompt}"
        
        if (messages.size() <= 1) {
            return currentPrompt;
        }
        
        // Include last 5 messages as context
        StringBuilder contextBuilder = new StringBuilder();
        int startIndex = Math.max(0, messages.size() - 6); // -6 because we don't want to include the just-added user message
        
        if (startIndex > 0) {
            contextBuilder.append("Previous conversation context:\n");
            for (int i = startIndex; i < messages.size() - 1; i++) {
                Message msg = messages.get(i);
                contextBuilder.append(msg.getRole() == MessageRole.USER ? "User: " : "Assistant: ");
                contextBuilder.append(msg.getContent());
                contextBuilder.append("\n");
            }
            contextBuilder.append("\nCurrent question: ");
        }
        
        contextBuilder.append(currentPrompt);
        return contextBuilder.toString();
    }
    
    private void pruneConversation(String userId) {
        List<Message> messages = conversations.get(userId);
        if (messages == null || messages.size() <= MAX_MESSAGES_IN_CONTEXT) {
            return;
        }
        
        // Keep only the most recent messages
        int toRemove = messages.size() - MAX_MESSAGES_IN_CONTEXT;
        messages.subList(0, toRemove).clear();
        
        log.debug("Pruned {} messages from conversation for user {}", toRemove, userId);
    }
    
    private String buildContextualPrompt(String userId, String currentMessage) {
        List<Message> messages = conversations.get(userId);
        if (messages == null || messages.size() <= 1) {
            return currentMessage;
        }
        
        // Get last few messages for context (exclude the current message we just added)
        int contextSize = Math.min(5, messages.size() - 1);
        List<Message> recentMessages = messages.subList(Math.max(0, messages.size() - contextSize - 1), messages.size() - 1);
        
        if (recentMessages.isEmpty()) {
            return currentMessage;
        }
        
        // Build contextual prompt
        StringBuilder contextPrompt = new StringBuilder();
        contextPrompt.append("Previous conversation context:\n");
        for (Message msg : recentMessages) {
            contextPrompt.append(msg.getRole() == MessageRole.USER ? "User: " : "Assistant: ");
            contextPrompt.append(msg.getContent());
            contextPrompt.append("\n");
        }
        contextPrompt.append("\nCurrent message: ").append(currentMessage);
        
        return contextPrompt.toString();
    }
    
    public List<ChatResponse> getUserMessages(String userId) {
        return conversations.getOrDefault(userId, new ArrayList<>())
                .stream()
                .map(ChatResponse::fromMessage)
                .collect(Collectors.toList());
    }
    
    public ChatResponse getMessage(long messageId) {
        return conversations.values().stream()
                .flatMap(List::stream)
                .filter(msg -> msg.getId() == messageId)
                .map(ChatResponse::fromMessage)
                .findFirst()
                .orElse(null);
    }
}
