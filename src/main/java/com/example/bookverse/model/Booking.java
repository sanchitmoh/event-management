package com.example.bookverse.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_booking_user", columnList = "user_id"),
    @Index(name = "idx_booking_event", columnList = "event_id"),
    @Index(name = "idx_booking_status", columnList = "status"),
    @Index(name = "idx_booking_payment_status", columnList = "payment_status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "booking_date", nullable = false)
    @CreationTimestamp
    private LocalDateTime bookingDate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingStatus status = BookingStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinTable(
        name = "booking_seats",
        joinColumns = @JoinColumn(name = "booking_id"),
        inverseJoinColumns = @JoinColumn(name = "seat_id")
    )
    private Set<EventSeat> seats = new HashSet<>();

    @Version
    private Long version;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    // Helper methods
    
    public void addSeat(EventSeat seat) {
        seats.add(seat);
    }
    
    public void removeSeat(EventSeat seat) {
        seats.remove(seat);
    }
    
    public void confirmBooking() {
        this.status = BookingStatus.CONFIRMED;
    }
    
    public void cancelBooking() {
        this.status = BookingStatus.CANCELLED;
        this.cancelledAt = LocalDateTime.now();
    }
    
    public void confirmPayment() {
        this.paymentStatus = PaymentStatus.COMPLETED;
        confirmBooking();
    }
    
    public void failPayment() {
        this.paymentStatus = PaymentStatus.FAILED;
    }
    
    public boolean isPending() {
        return status == BookingStatus.PENDING;
    }
    
    public boolean isConfirmed() {
        return status == BookingStatus.CONFIRMED;
    }
    
    public boolean isCancelled() {
        return status == BookingStatus.CANCELLED;
    }
} 