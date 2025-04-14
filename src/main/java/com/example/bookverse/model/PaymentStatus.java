package com.example.bookverse.model;

/**
 * Enum representing the possible statuses of a payment.
 */
public enum PaymentStatus {
    PENDING,    // Payment is initiated but not completed
    COMPLETED,  // Payment is successfully completed
    FAILED,     // Payment has failed
    REFUNDED    // Payment was refunded
} 