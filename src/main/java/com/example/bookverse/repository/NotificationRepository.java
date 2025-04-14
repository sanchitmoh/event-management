package com.example.bookverse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.bookverse.model.Notification;
import com.example.bookverse.model.User;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByTimestampDesc(User user);
    List<Notification> findByUserAndReadOrderByTimestampDesc(User user, boolean read);
    long countByUserAndRead(User user, boolean read);
} 