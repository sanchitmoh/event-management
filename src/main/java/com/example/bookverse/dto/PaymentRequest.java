package com.example.bookverse.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentRequest {
    private String orderId;
    private BigDecimal amount;
    private String currency;
    private String eventType; // CONCERT, MOVIE, SPORT, EVENT
    private Long eventId;
    private String[] seatIds;
    private String bookingNotes;
} 