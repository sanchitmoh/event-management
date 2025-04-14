package com.example.bookverse.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "event_seats", indexes = {
    @Index(name = "idx_event_seat_status", columnList = "status"),
    @Index(name = "idx_event_seat_section", columnList = "section")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private String seatNumber;

    @Column(nullable = false)
    private String section;

    @Column(nullable = false)
    private Integer row;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SeatStatus status = SeatStatus.AVAILABLE;

    @Column(nullable = false)
    private BigDecimal price;

    @Column
    private String description;

    @Version
    private Long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Helper methods
    
    public boolean isAvailable() {
        return status == SeatStatus.AVAILABLE;
    }
    
    public boolean reserve() {
        if (status == SeatStatus.AVAILABLE) {
            status = SeatStatus.RESERVED;
            return true;
        }
        return false;
    }
    
    public boolean book() {
        if (status == SeatStatus.RESERVED || status == SeatStatus.AVAILABLE) {
            status = SeatStatus.BOOKED;
            return true;
        }
        return false;
    }
    
    public boolean release() {
        if (status == SeatStatus.RESERVED) {
            status = SeatStatus.AVAILABLE;
            return true;
        }
        return false;
    }
} 