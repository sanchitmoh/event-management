package com.example.bookverse.service;

import java.util.List;

import com.example.bookverse.dto.PaymentRequest;
import com.example.bookverse.dto.PaymentResponse;
import com.example.bookverse.model.Payment;
import com.example.bookverse.model.User;

public interface PaymentService {
    PaymentResponse createOrder(PaymentRequest paymentRequest, User user);
    PaymentResponse verifyAndUpdatePayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature);
    List<Payment> getPaymentsByUser(User user);
    Payment getPaymentByOrderId(String orderId);
} 