package com.chatbot.service;

import com.chatbot.dto.ChatRequest;
import com.chatbot.dto.ChatResponse;
import com.chatbot.entity.Message;
import com.chatbot.entity.MessageRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {
    
    private final GeminiService geminiService;
    private final Map<String, List<Message>> conversations = new HashMap<>();
    private long messageIdCounter = 0;
    
    public ChatResponse sendMessage(ChatRequest request) {
        // Generate response from Gemini
        String aiResponse = geminiService.generateResponse(request.getContent(), request.getModel());
        
        // Create assistant message
        Message assistantMessage = Message.builder()
                .id(++messageIdCounter)
                .userId(request.getUserId())
                .content(aiResponse)
                .role(MessageRole.ASSISTANT)
                .model(request.getModel())
                .createdAt(LocalDateTime.now())
                .build();
        
        // Store in memory
        conversations.computeIfAbsent(request.getUserId(), k -> new ArrayList<>()).add(assistantMessage);
        
        return ChatResponse.fromMessage(assistantMessage);
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
