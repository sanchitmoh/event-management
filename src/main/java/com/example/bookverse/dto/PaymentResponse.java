package com.example.bookverse.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    private String keyId;
    private String status;
    private String paymentId;
    private String orderId;
    private String errorMessage;
} 