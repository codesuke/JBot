package com.chatbot.exception;

import com.chatbot.dto.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RateLimitException.class)
    public ResponseEntity<ErrorResponse> handleRateLimitException(RateLimitException ex) {
        log.warn("Rate limit exceeded: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.builder()
                .error("Rate Limit Exceeded")
                .message(ex.getMessage())
                .errorCode("RATE_LIMIT")
                .retryable(true)
                .retryAfter(ex.getRetryAfterSeconds())
                .timestamp(System.currentTimeMillis())
                .build();
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(error);
    }
    
    @ExceptionHandler(AIServiceException.class)
    public ResponseEntity<ErrorResponse> handleAIServiceException(AIServiceException ex) {
        log.error("AI Service error: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.builder()
                .error("AI Service Error")
                .message(ex.getMessage())
                .errorCode(ex.getErrorCode())
                .retryable(ex.isRetryable())
                .timestamp(System.currentTimeMillis())
                .build();
        
        HttpStatus status = ex.isRetryable() ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(error);
    }
    
    @ExceptionHandler(ContentFilteredException.class)
    public ResponseEntity<ErrorResponse> handleContentFilteredException(ContentFilteredException ex) {
        log.warn("Content filtered: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.builder()
                .error("Content Filtered")
                .message("Your message was blocked by safety filters. Please rephrase and try again.")
                .errorCode("CONTENT_FILTERED")
                .retryable(false)
                .timestamp(System.currentTimeMillis())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        
        ErrorResponse error = ErrorResponse.builder()
                .error("Validation Error")
                .message(message)
                .errorCode("VALIDATION_ERROR")
                .retryable(false)
                .timestamp(System.currentTimeMillis())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        ErrorResponse error = ErrorResponse.builder()
                .error("Internal Server Error")
                .message("An unexpected error occurred. Please try again later.")
                .errorCode("INTERNAL_ERROR")
                .retryable(true)
                .timestamp(System.currentTimeMillis())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
