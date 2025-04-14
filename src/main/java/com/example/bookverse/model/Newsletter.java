package com.example.bookverse.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "newsletter_subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Newsletter {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String name;
    
    @Column(name = "subscribed_at")
    private LocalDateTime subscribedAt;
    
    private boolean active = true;
    
    @PrePersist
    protected void onCreate() {
        subscribedAt = LocalDateTime.now();
    }
} 