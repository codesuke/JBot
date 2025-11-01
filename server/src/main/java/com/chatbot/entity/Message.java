package com.chatbot.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    
    private Long id;
    
    private String userId;
    
    private String content;
    
    private MessageRole role; // USER or ASSISTANT
    
    private String model;
    
    private Double tokens;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
