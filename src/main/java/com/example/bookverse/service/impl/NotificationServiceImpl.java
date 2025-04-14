package com.example.bookverse.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.bookverse.dto.NotificationMessage;
import com.example.bookverse.model.ERole;
import com.example.bookverse.model.Notification;
import com.example.bookverse.model.Role;
import com.example.bookverse.model.User;
import com.example.bookverse.repository.NotificationRepository;
import com.example.bookverse.repository.UserRepository;
import com.example.bookverse.service.NotificationService;
@Service
public class NotificationServiceImpl implements NotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public void sendPrivateNotification(String username, NotificationMessage message) {
        try {
            if (message.getTimestamp() == null) {
                message.setTimestamp(LocalDateTime.now());
            }
            
            logger.info("Sending private notification to user: {}", username);
            messagingTemplate.convertAndSendToUser(
                    username,
                    "/queue/notifications",
                    message
            );
            logger.info("Private notification sent successfully to: {}", username);
        } catch (MessagingException e) {
            logger.error("Error sending private notification to {}: {}", username, e.getMessage());
        }
    }
    
    @Override
    public void sendGlobalNotification(NotificationMessage message) {
        try {
            if (message.getTimestamp() == null) {
                message.setTimestamp(LocalDateTime.now());
            }
            
            logger.info("Sending global notification");
            messagingTemplate.convertAndSend("/topic/global-notifications", message);
            logger.info("Global notification sent successfully");
        } catch (MessagingException e) {
            logger.error("Error sending global notification: {}", e.getMessage());
        }
    }
    
    @Override
    public void sendLoginNotification(String username) {
        NotificationMessage notification = NotificationMessage.builder()
                .type("LOGIN")
                .message("Welcome back, " + username + "! You have successfully logged in.")
                .severity("SUCCESS")
                .timestamp(LocalDateTime.now())
                .build();
        
        sendPrivateNotification(username, notification);
    }
    
    @Override
    @Transactional
    public Notification createNotification(User user, String message, String type) {
        logger.info("Creating notification for user: {}", user.getUsername());
        
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .type(type)
                .timestamp(LocalDateTime.now())
                .read(false)
                .build();
        
        return notificationRepository.save(notification);
    }
    
    @Override
    @Transactional
    public Notification createAndSendNotification(User user, String message, String type) {
        // Create persistent notification
        Notification savedNotification = createNotification(user, message, type);
        
        // Send realtime notification via WebSocket
        NotificationMessage notificationMessage = NotificationMessage.builder()
                .type(type)
                .message(message)
                .severity("INFO")
                .timestamp(LocalDateTime.now())
                .data(savedNotification.getId())
                .build();
        
        sendPrivateNotification(user.getUsername(), notificationMessage);
        
        return savedNotification;
    }
    
    @Override
    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByTimestampDesc(user);
    }
    
    @Override
    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndReadOrderByTimestampDesc(user, false);
    }
    
    @Override
    public long countUnreadNotifications(User user) {
        return notificationRepository.countByUserAndRead(user, false);
    }
    
    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        logger.info("Marking notification as read: {}", notificationId);
        
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        User currentUser = getCurrentUser();
        
        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to modify this notification");
        }
        
        notification.setRead(true);
        notificationRepository.save(notification);
    }
    
    @Override
    @Transactional
    public void markAllAsRead(User user) {
        logger.info("Marking all notifications as read for user: {}", user.getUsername());
        
        List<Notification> unreadNotifications = notificationRepository.findByUserAndReadOrderByTimestampDesc(user, false);
        
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }
    
    @Override
    @Transactional
    public void deleteNotification(Long notificationId) {
        logger.info("Deleting notification: {}", notificationId);
        
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        User currentUser = getCurrentUser();
        
        if (!notification.getUser().getId().equals(currentUser.getId()) && 
            !hasAdminRole(currentUser)) {
            throw new RuntimeException("You don't have permission to delete this notification");
        }
        
        notificationRepository.deleteById(notificationId);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    private boolean hasAdminRole(User user) {
        for (Role role : user.getRoles()) {
            if (role.getName() == ERole.ROLE_ADMIN) {
                return true;
            }
        }
        return false;
    }
    
    @Override
    public void sendNotification(User user, String title, String message) {
        // Create and send notification using existing methods
        createAndSendNotification(user, message, title);
    }
    
    @Override
    public void sendBookingNotification(User user, String title, String message) {
        // Create notification with booking type
        Notification notification = createNotification(user, message, "BOOKING");
        
        // Send real-time notification
        NotificationMessage notificationMessage = NotificationMessage.builder()
                .type("BOOKING")
                .message(message)
                .severity("INFO")
                .timestamp(LocalDateTime.now())
                .data(notification.getId())
                .build();
        
        sendPrivateNotification(user.getUsername(), notificationMessage);
    }
} 