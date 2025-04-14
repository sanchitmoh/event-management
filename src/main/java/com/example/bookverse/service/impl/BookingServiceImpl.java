package com.example.bookverse.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.bookverse.exception.ResourceNotFoundException;
import com.example.bookverse.exception.SeatNotAvailableException;
import com.example.bookverse.model.Booking;
import com.example.bookverse.model.BookingStatus;
import com.example.bookverse.model.Event;
import com.example.bookverse.model.EventSeat;
import com.example.bookverse.model.PaymentStatus;
import com.example.bookverse.model.SeatStatus;
import com.example.bookverse.model.User;
import com.example.bookverse.repository.BookingRepository;
import com.example.bookverse.repository.EventRepository;
import com.example.bookverse.repository.EventSeatRepository;
import com.example.bookverse.service.BookingService;
import com.example.bookverse.service.NotificationService;

@Service
public class BookingServiceImpl implements BookingService {

    private static final String SEAT_LOCK_PREFIX = "seat:lock:";
    private static final long SEAT_LOCK_TIMEOUT = 30; // seconds
    private static final long BOOKING_EXPIRATION = 15; // minutes

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventSeatRepository seatRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    @Transactional
    public Booking createBooking(User user, Event event, Set<EventSeat> selectedSeats) {
        // Calculate total amount
        BigDecimal totalAmount = selectedSeats.stream()
                .map(EventSeat::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setBookingDate(LocalDateTime.now());
        booking.setTotalAmount(totalAmount);
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setSeats(selectedSeats);
        
        // Save booking
        Booking savedBooking = bookingRepository.save(booking);
        
        // Invalidate caches
        evictEventCaches(event.getId());
        evictUserBookingsCache(user.getId());
        
        // Send notification
        notificationService.sendNotification(user, 
                "Booking created", 
                "Your booking for " + event.getName() + " is pending confirmation.");
        
        return savedBooking;
    }

    @Override
    @Cacheable(value = "bookingCache", key = "#id")
    public Optional<Booking> findBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    @Override
    @Cacheable(value = "userBookingsCache", key = "#user.id")
    public List<Booking> findBookingsByUser(User user) {
        return bookingRepository.findByUser(user);
    }

    @Override
    @Transactional
    @CacheEvict(value = "bookingCache", key = "#bookingId")
    public Booking confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findByIdWithLock(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        booking.setStatus(BookingStatus.CONFIRMED);
        
        // Invalidate caches
        evictEventCaches(booking.getEvent().getId());
        evictUserBookingsCache(booking.getUser().getId());
        
        // Send notification
        notificationService.sendBookingNotification(booking.getUser(), 
                "Booking confirmed", 
                "Your booking for " + booking.getEvent().getName() + " has been confirmed.");
        
        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    @CacheEvict(value = "bookingCache", key = "#bookingId")
    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findByIdWithLock(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Release the seats
        releaseSeats(booking);
        
        booking.setStatus(BookingStatus.CANCELLED);
        
        // Invalidate caches
        evictEventCaches(booking.getEvent().getId());
        evictUserBookingsCache(booking.getUser().getId());
        
        // Send notification
        notificationService.sendBookingNotification(booking.getUser(), 
                "Booking cancelled", 
                "Your booking for " + booking.getEvent().getName() + " has been cancelled.");
        
        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    @CacheEvict(value = "bookingCache", key = "#bookingId")
    public Booking confirmPayment(Long bookingId) {
        Booking booking = bookingRepository.findByIdWithLock(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        
        booking.setPaymentStatus(PaymentStatus.COMPLETED);
        
        // If booking was pending, confirm it
        if (booking.getStatus() == BookingStatus.PENDING) {
            booking.setStatus(BookingStatus.CONFIRMED);
        }
        
        // Invalidate caches
        evictEventCaches(booking.getEvent().getId());
        evictUserBookingsCache(booking.getUser().getId());
        
        // Send notification
        notificationService.sendBookingNotification(booking.getUser(), 
                "Payment confirmed", 
                "Your payment for " + booking.getEvent().getName() + " has been confirmed.");
        
        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public Set<EventSeat> reserveSeats(Event event, List<Long> seatIds) {
        // Acquire distributed locks for all seats to prevent race conditions
        if (!acquireSeatsLock(seatIds)) {
            throw new SeatNotAvailableException("Some seats are currently being processed by another request");
        }
        
        try {
            // Fetch the latest event with pessimistic lock
            Event lockedEvent = eventRepository.findByIdWithLock(event.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + event.getId()));
            
            // Fetch seats
            List<EventSeat> seats = seatRepository.findAllById(seatIds);
            
            // Check if all seats are available
            List<EventSeat> unavailableSeats = seats.stream()
                    .filter(seat -> seat.getStatus() != SeatStatus.AVAILABLE)
                    .collect(Collectors.toList());
            
            if (!unavailableSeats.isEmpty()) {
                throw new SeatNotAvailableException("Some selected seats are not available: " + 
                        unavailableSeats.stream().map(s -> s.getRow() + "-" + s.getSeatNumber()).collect(Collectors.joining(", ")));
            }
            
            // Reserve seats
            seats.forEach(seat -> seat.setStatus(SeatStatus.RESERVED));
            seats = seatRepository.saveAll(seats);
            
            // Update available seats count in event
            lockedEvent.setAvailableSeats(lockedEvent.getAvailableSeats() - seats.size());
            eventRepository.save(lockedEvent);
            
            // Invalidate caches
            evictEventCaches(event.getId());
            
            return new HashSet<>(seats);
        } finally {
            // Release locks
            releaseSeatsLock(seatIds);
        }
    }

    @Override
    @Transactional
    public void releaseSeats(Booking booking) {
        // Acquire distributed locks for all seats
        List<Long> seatIds = booking.getSeats().stream()
                .map(EventSeat::getId)
                .collect(Collectors.toList());
        
        if (!acquireSeatsLock(seatIds)) {
            throw new SeatNotAvailableException("Some seats are currently being processed by another request");
        }
        
        try {
            // Fetch the latest event with pessimistic lock
            Event lockedEvent = eventRepository.findByIdWithLock(booking.getEvent().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + booking.getEvent().getId()));
            
            // Update seat status to AVAILABLE
            booking.getSeats().forEach(seat -> seat.setStatus(SeatStatus.AVAILABLE));
            seatRepository.saveAll(booking.getSeats());
            
            // Update available seats count in event
            lockedEvent.setAvailableSeats(lockedEvent.getAvailableSeats() + booking.getSeats().size());
            eventRepository.save(lockedEvent);
            
            // Invalidate caches
            evictEventCaches(booking.getEvent().getId());
        } finally {
            // Release locks
            releaseSeatsLock(seatIds);
        }
    }

    @Override
    @Scheduled(fixedRate = 5 * 60 * 1000) // Run every 5 minutes
    @Transactional
    public void cleanupExpiredBookings() {
        LocalDateTime expirationTime = LocalDateTime.now().minusMinutes(BOOKING_EXPIRATION);
        List<Booking> expiredBookings = bookingRepository.findPendingBookingsToExpire(expirationTime);
        
        for (Booking booking : expiredBookings) {
            cancelBooking(booking.getId());
        }
    }
    
    /* Helper methods for distributed locking and cache invalidation */
    
    private boolean acquireSeatsLock(List<Long> seatIds) {
        for (Long seatId : seatIds) {
            String lockKey = SEAT_LOCK_PREFIX + seatId;
            Boolean locked = redisTemplate.opsForValue().setIfAbsent(lockKey, "LOCKED", SEAT_LOCK_TIMEOUT, TimeUnit.SECONDS);
            if (locked == null || !locked) {
                // If any lock fails, release all acquired locks and return false
                seatIds.stream()
                        .limit(seatIds.indexOf(seatId))
                        .forEach(id -> redisTemplate.delete(SEAT_LOCK_PREFIX + id));
                return false;
            }
        }
        return true;
    }
    
    private void releaseSeatsLock(List<Long> seatIds) {
        seatIds.forEach(seatId -> redisTemplate.delete(SEAT_LOCK_PREFIX + seatId));
    }
    
    private void evictEventCaches(Long eventId) {
        redisTemplate.delete("eventCache::" + eventId);
        redisTemplate.delete("availableSeatsCache::" + eventId);
        redisTemplate.delete("eventsByCategoryCache");
        redisTemplate.delete("upcomingEventsCache");
        redisTemplate.delete("featuredEventsCache");
    }
    
    private void evictUserBookingsCache(Long userId) {
        redisTemplate.delete("userBookingsCache::" + userId);
    }
} 