package com.example.bookverse.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.bookverse.model.Booking;
import com.example.bookverse.model.BookingStatus;
import com.example.bookverse.model.Event;
import com.example.bookverse.model.User;

import jakarta.persistence.LockModeType;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find booking with pessimistic lock to prevent concurrent updates
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Booking b WHERE b.id = :id")
    Optional<Booking> findByIdWithLock(@Param("id") Long id);

    // Find bookings by user
    List<Booking> findByUser(User user);

    // Find bookings by user paged
    Page<Booking> findByUser(User user, Pageable pageable);

    // Find bookings by user and status
    List<Booking> findByUserAndStatus(User user, BookingStatus status);

    // Find bookings by event
    List<Booking> findByEvent(Event event);

    // Find bookings by event and status
    List<Booking> findByEventAndStatus(Event event, BookingStatus status);

    // Find recent bookings by user
    @Query("SELECT b FROM Booking b WHERE b.user = :user AND b.bookingDate >= :since ORDER BY b.bookingDate DESC")
    List<Booking> findRecentBookingsByUser(@Param("user") User user, @Param("since") LocalDateTime since, Pageable pageable);

    // Count bookings by event
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.event = :event AND b.status = :status")
    Long countByEventAndStatus(@Param("event") Event event, @Param("status") BookingStatus status);

    // Find pending bookings that are about to expire (for cleanup)
    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' AND b.bookingDate < :expirationTime")
    List<Booking> findPendingBookingsToExpire(@Param("expirationTime") LocalDateTime expirationTime);
} 