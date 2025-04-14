package com.example.bookverse.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookverse.dto.PaymentRequest;
import com.example.bookverse.dto.PaymentResponse;
import com.example.bookverse.model.Payment;
import com.example.bookverse.model.User;
import com.example.bookverse.repository.UserRepository;
import com.example.bookverse.security.service.UserDetailsImpl;
import com.example.bookverse.service.PaymentService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/create-order")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PaymentResponse> createOrder(
            @RequestBody PaymentRequest paymentRequest,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        // If no order ID provided, generate one
        if (paymentRequest.getOrderId() == null || paymentRequest.getOrderId().isEmpty()) {
            paymentRequest.setOrderId("ORD_" + UUID.randomUUID().toString().substring(0, 8));
        }
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        PaymentResponse response = paymentService.createOrder(paymentRequest, user);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/verify")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PaymentResponse> verifyPayment(
            @RequestParam String razorpay_order_id,
            @RequestParam String razorpay_payment_id,
            @RequestParam String razorpay_signature) {
        
        PaymentResponse response = paymentService.verifyAndUpdatePayment(
                razorpay_order_id, razorpay_payment_id, razorpay_signature);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Payment>> getUserPayments(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Payment> payments = paymentService.getPaymentsByUser(user);
        
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Payment> getPaymentDetails(@PathVariable String orderId) {
        Payment payment = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(payment);
    }
} 