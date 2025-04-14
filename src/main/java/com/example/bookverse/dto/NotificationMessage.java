package com.example.bookverse.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationMessage {
    private String type;        // 'LOGIN', 'PAYMENT', 'EVENT', etc.
    private String message;     // The notification text
    private String severity;    // 'INFO', 'SUCCESS', 'WARNING', 'ERROR'
    private LocalDateTime timestamp;
    private Object data;        // Optional additional data
} 