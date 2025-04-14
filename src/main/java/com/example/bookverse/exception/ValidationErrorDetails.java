package com.example.bookverse.exception;

import java.util.Date;
import java.util.Map;

import lombok.Getter;

@Getter
public class ValidationErrorDetails extends ErrorDetails {
    
    private final Map<String, String> validationErrors;

    public ValidationErrorDetails(Date timestamp, String message, String details, Map<String, String> validationErrors) {
        super(timestamp, message, details);
        this.validationErrors = validationErrors;
    }
} 