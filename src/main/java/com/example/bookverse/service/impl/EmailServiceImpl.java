package com.example.bookverse.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.bookverse.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Async
    @Override
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            logger.info("Sending email to: {}", to);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
            
            logger.info("Email sent successfully to: {}", to);
        } catch (MailException e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
    
    @Async
    @Override
    public void sendWelcomeEmail(String to, String username) {
        String subject = "Welcome to Event Management System!";
        String text = String.format("""
                                    Hello %s,
                                    
                                    Welcome to our Event Management System! We're excited to have you join us.
                                    
                                    With your new account, you can browse events, purchase tickets, and get updates on your favorite concerts, sports, and more.
                                    
                                    Best regards,
                                    The Event Management Team""",
                username);
        
        sendSimpleEmail(to, subject, text);
    }
    
    @Async
    @Override
    public void sendLoginNotification(String to, String username) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String subject = "New Login Detected";
        String text = String.format("""
                                    Hello %s,
                                    
                                    We detected a new login to your Event Management account at %s.
                                    
                                    If this was you, you can safely ignore this email. If you did not login recently, please contact our support team immediately.
                                    
                                    Best regards,
                                    The Event Management Team""",
                username, timestamp);
        
        sendSimpleEmail(to, subject, text);
    }
} 