package com.example.bookverse.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.example.bookverse.model.Booking;
import com.example.bookverse.model.Event;
import com.example.bookverse.model.EventSeat;
import com.example.bookverse.model.User;

public interface BookingService {

    /**
     * Create a new booking with selected seats
     * @param user User making the booking
     * @param event Event being booked
     * @param selectedSeats Set of seats selected for booking
     * @return Created booking
     */
    Booking createBooking(User user, Event event, Set<EventSeat> selectedSeats);
    
    /**
     * Find a booking by its ID
     * @param id Booking ID
     * @return Optional containing the booking if found
     */
    Optional<Booking> findBookingById(Long id);
    
    /**
     * Find bookings by user
     * @param user User to find bookings for
     * @return List of user's bookings
     */
    List<Booking> findBookingsByUser(User user);
    
    /**
     * Confirm a booking
     * @param bookingId Booking ID
     * @return Updated booking
     */
    Booking confirmBooking(Long bookingId);
    
    /**
     * Cancel a booking
     * @param bookingId Booking ID
     * @return Updated booking
     */
    Booking cancelBooking(Long bookingId);
    
    /**
     * Confirm payment for a booking
     * @param bookingId Booking ID
     * @return Updated booking
     */
    Booking confirmPayment(Long bookingId);
    
    /**
     * Reserve seats for a booking with distributed lock to prevent race conditions
     * @param event Event to reserve seats for
     * @param seatIds List of seat IDs to reserve
     * @return Set of reserved seats
     */
    Set<EventSeat> reserveSeats(Event event, List<Long> seatIds);
    
    /**
     * Release reserved seats when booking is not completed
     * @param booking Booking containing seats to release
     */
    void releaseSeats(Booking booking);
    
    /**
     * Process expired pending bookings to release seats
     */
    void cleanupExpiredBookings();
} 