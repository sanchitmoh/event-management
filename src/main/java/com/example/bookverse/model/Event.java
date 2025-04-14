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
@Table(name = "events", indexes = {
    @Index(name = "idx_event_start_date", columnList = "start_date"),
    @Index(name = "idx_event_status", columnList = "status"),
    @Index(name = "idx_event_category", columnList = "category")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(nullable = false, length = 200)
    private String venue;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EventStatus status = EventStatus.UPCOMING;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<EventSeat> seats = new HashSet<>();

    @Version
    private Long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // Helper method to reduce available seats
    public boolean decreaseAvailableSeats(int count) {
        if (availableSeats >= count) {
            availableSeats -= count;
            return true;
        }
        return false;
    }

    // Helper method to increase available seats (for cancellations)
    public void increaseAvailableSeats(int count) {
        availableSeats += count;
        if (availableSeats > totalSeats) {
            availableSeats = totalSeats;
        }
    }

    // Soft delete method
    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
        this.status = EventStatus.CANCELLED;
    }

    // Check if event is deleted
    public boolean isDeleted() {
        return deletedAt != null;
    }

    // Check if event is available for booking
    public boolean isAvailableForBooking() {
        return status == EventStatus.UPCOMING && 
               availableSeats > 0 && 
               startDate.isAfter(LocalDateTime.now()) &&
               deletedAt == null;
    }
} 