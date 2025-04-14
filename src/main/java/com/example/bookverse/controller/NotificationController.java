package com.example.bookverse.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookverse.dto.MessageResponse;
import com.example.bookverse.dto.NotificationMessage;
import com.example.bookverse.model.Notification;
import com.example.bookverse.model.User;
import com.example.bookverse.repository.UserRepository;
import com.example.bookverse.service.NotificationService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Notification>> getUserNotifications(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Notification> notifications = notificationService.getUserNotifications(user);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/unread")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Notification> notifications = notificationService.getUnreadNotifications(user);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/count")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Long> getUnreadCount(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Long count = notificationService.countUnreadNotifications(user);
        return ResponseEntity.ok(count);
    }
    
    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, Principal principal) {
        // Note: Permission checking is handled at the service level
        try {
            notificationService.markAsRead(id);
            return ResponseEntity.ok(new MessageResponse("Notification marked as read"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @PutMapping("/read-all")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> markAllAsRead(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok(new MessageResponse("All notifications marked as read"));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id, Principal principal) {
        try {
            notificationService.deleteNotification(id);
            return ResponseEntity.ok(new MessageResponse("Notification deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @PostMapping("/test")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> sendTestNotification(Principal principal) {
        try {
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Create a persistent notification and send it through WebSocket too
            @SuppressWarnings("unused")
            Notification notification = notificationService.createAndSendNotification(
                user, 
                "This is a test notification. It was created on demand.",
                "TEST"
            );
            
            return ResponseEntity.ok(new MessageResponse("Test notification sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error sending test notification: " + e.getMessage()));
        }
    }
    
    @PostMapping("/send/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> sendNotificationToUser(@PathVariable String username, @RequestBody NotificationMessage notification) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            notificationService.createAndSendNotification(
                user, 
                notification.getMessage(),
                notification.getType() != null ? notification.getType() : "INFO"
            );
            
            return ResponseEntity.ok(new MessageResponse("Notification sent to " + username + " successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error sending notification: " + e.getMessage()));
        }
    }
} 