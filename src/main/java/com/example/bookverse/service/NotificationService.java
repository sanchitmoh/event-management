package com.example.bookverse.service;

import java.util.List;

import com.example.bookverse.dto.NotificationMessage;
import com.example.bookverse.model.Notification;
import com.example.bookverse.model.User;

public interface NotificationService {
    // WebSocket notifications
    void sendPrivateNotification(String username, NotificationMessage message);
    void sendGlobalNotification(NotificationMessage message);
    void sendLoginNotification(String username);
    
    // Persistent notifications
    Notification createNotification(User user, String message, String type);
    Notification createAndSendNotification(User user, String message, String type);
    List<Notification> getUserNotifications(User user);
    List<Notification> getUnreadNotifications(User user);
    long countUnreadNotifications(User user);
    void markAsRead(Long notificationId);
    void markAllAsRead(User user);
    void deleteNotification(Long notificationId);
    void sendNotification(User user, String string, String string2);
    void sendBookingNotification(User user, String string, String string2);
} 