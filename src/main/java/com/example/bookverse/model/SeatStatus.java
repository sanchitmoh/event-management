package com.example.bookverse.model;

/**
 * Enumeration of possible seat statuses in the system.
 */
public enum SeatStatus {
    /**
     * Seat is available for booking
     */
    AVAILABLE,
    
    /**
     * Seat is temporarily reserved during a booking process
     */
    RESERVED,
    
    /**
     * Seat has been booked/purchased
     */
    BOOKED,
    
    /**
     * Seat is not available for booking (e.g., maintenance, blocked)
     */
    UNAVAILABLE
} 