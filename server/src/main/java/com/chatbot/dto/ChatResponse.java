package com.chatbot.dto;

import com.chatbot.entity.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResponse {
    private Long id;
    private String content;
    private String role;
    private String model;
    private LocalDateTime timestamp;
    private Double tokens;

    public static ChatResponse fromMessage(Message message) {
        return ChatResponse.builder()
                .id(message.getId())
                .content(message.getContent())
                .role(message.getRole().toString())
                .model(message.getModel())
                .timestamp(message.getCreatedAt())
                .tokens(message.getTokens())
                .build();
    }
}
