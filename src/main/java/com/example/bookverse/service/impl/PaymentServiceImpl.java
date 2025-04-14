package com.example.bookverse.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.bookverse.dto.PaymentRequest;
import com.example.bookverse.dto.PaymentResponse;
import com.example.bookverse.model.Payment;
import com.example.bookverse.model.User;
import com.example.bookverse.repository.PaymentRepository;
import com.example.bookverse.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private RazorpayClient razorpayClient;
    
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    
    @Override
    @Transactional
    public PaymentResponse createOrder(PaymentRequest paymentRequest, User user) {
        try {
            // Convert amount to paise/cents (Razorpay expects amount in smallest currency unit)
            int amountInSmallestUnit = paymentRequest.getAmount()
                    .multiply(new BigDecimal(100))
                    .intValue();
            
            // Create Razorpay Order
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInSmallestUnit);
            orderRequest.put("currency", paymentRequest.getCurrency());
            orderRequest.put("receipt", paymentRequest.getOrderId());
            orderRequest.put("payment_capture", 1); // Auto capture payment
            
            // Create order in Razorpay
            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");
            
            // Save payment info to our database
            Payment payment = new Payment();
            payment.setOrderId(paymentRequest.getOrderId());
            payment.setRazorpayOrderId(razorpayOrderId);
            payment.setRazorpayPaymentId(null); // Will be updated after payment
            payment.setAmount(paymentRequest.getAmount());
            payment.setCurrency(paymentRequest.getCurrency());
            payment.setStatus("CREATED");
            payment.setUser(user);
            
            paymentRepository.save(payment);
            
            // Return response for frontend
            return PaymentResponse.builder()
                    .razorpayOrderId(razorpayOrderId)
                    .amount(paymentRequest.getAmount())
                    .currency(paymentRequest.getCurrency())
                    .keyId(razorpayKeyId)
                    .status("CREATED")
                    .orderId(paymentRequest.getOrderId())
                    .build();
            
        } catch (RazorpayException e) {
            return PaymentResponse.builder()
                    .status("ERROR")
                    .errorMessage(e.getMessage())
                    .build();
        }
    }
    
    @Override
    @Transactional
    public PaymentResponse verifyAndUpdatePayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            // Verify payment signature
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);
            
            boolean isValidSignature = Utils.verifyPaymentSignature(options, razorpayKeyId);
            
            if (!isValidSignature) {
                return PaymentResponse.builder()
                        .status("ERROR")
                        .errorMessage("Invalid payment signature")
                        .build();
            }
            
            // Update payment status in our database
            Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                    .orElseThrow(() -> new RuntimeException("Payment not found with orderId: " + razorpayOrderId));
            
            payment.setRazorpayPaymentId(razorpayPaymentId);
            payment.setStatus("COMPLETED");
            paymentRepository.save(payment);
            
            return PaymentResponse.builder()
                    .razorpayOrderId(razorpayOrderId)
                    .paymentId(razorpayPaymentId)
                    .amount(payment.getAmount())
                    .currency(payment.getCurrency())
                    .status("COMPLETED")
                    .orderId(payment.getOrderId())
                    .build();
            
        } catch (RazorpayException e) {
            return PaymentResponse.builder()
                    .status("ERROR")
                    .errorMessage(e.getMessage())
                    .build();
        } catch (JSONException e) {
            return PaymentResponse.builder()
                    .status("ERROR")
                    .errorMessage("Error verifying payment: " + e.getMessage())
                    .build();
        }
    }
    
    @Override
    public List<Payment> getPaymentsByUser(User user) {
        return paymentRepository.findByUser(user);
    }
    
    @Override
    public Payment getPaymentByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found with orderId: " + orderId));
    }
} 