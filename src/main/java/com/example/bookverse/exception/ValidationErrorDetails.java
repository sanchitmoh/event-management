package com.example.bookverse.exception;

import lombok.Getter;

import java.util.Date;
import java.util.Map;

@Getter
public class ValidationErrorDetails extends ErrorDetails {
    // Getter
    private final Map<String, String> validationErrors;

    public ValidationErrorDetails(Date timestamp, String message, String details, String errorCode, Map<String, String> validationErrors) {
        super(timestamp, message, details, errorCode);
        this.validationErrors = validationErrors;
    }

}
