package com.chatbot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRequest {
    @NotBlank(message = "Content cannot be empty")
    private String content;
    
    private String model;
    
    @NotBlank(message = "User ID cannot be empty")
    private String userId;
}
