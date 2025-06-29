package com.employeeProduct.employee;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request) {
        log.error("Global exception handler caught: {}", ex.getMessage(), ex);
        
        String errorMessage = "Internal server error occurred. Please try again later.";
        
       
        if (ex.getMessage() != null && ex.getMessage().contains("MongoDB")) {
            errorMessage = "Database connection error. Please check the connection and try again.";
        }
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("{\"error\": \"" + errorMessage + "\", \"details\": \"" + ex.getMessage() + "\"}");
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex, WebRequest request) {
        log.error("Runtime exception handler caught: {}", ex.getMessage(), ex);
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("{\"error\": \"" + ex.getMessage() + "\"}");
    }
} 