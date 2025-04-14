package com.example.bookverse.service;

public interface EmailService {
    void sendSimpleEmail(String to, String subject, String text);
    void sendWelcomeEmail(String to, String username);
    void sendLoginNotification(String to, String username);
} 