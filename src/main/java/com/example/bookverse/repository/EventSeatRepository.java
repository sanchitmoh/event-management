package com.example.bookverse.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.bookverse.model.Event;
import com.example.bookverse.model.EventSeat;
import com.example.bookverse.model.SeatStatus;

import jakarta.persistence.LockModeType;

@Repository
public interface EventSeatRepository extends JpaRepository<EventSeat, Long> {
    
    // Find seat with pessimistic lock for updates
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM EventSeat s WHERE s.id = :id")
    Optional<EventSeat> findByIdWithLock(@Param("id") Long id);
    
    // Find all seats for an event
    List<EventSeat> findByEvent(Event event);
    
    // Find seats by event and status
    List<EventSeat> findByEventAndStatus(Event event, SeatStatus status);
    
    // Find seats by event and section
    List<EventSeat> findByEventAndSection(Event event, String section);
    
    // Find available seats for an event
    @Query("SELECT s FROM EventSeat s WHERE s.event.id = :eventId AND s.status = :status")
    List<EventSeat> findAvailableSeats(@Param("eventId") Long eventId, @Param("status") SeatStatus status);
    
    // Count available seats for an event
    @Query("SELECT COUNT(s) FROM EventSeat s WHERE s.event.id = :eventId AND s.status = :status")
    Long countAvailableSeats(@Param("eventId") Long eventId, @Param("status") SeatStatus status);
    
    // Find seats by multiple IDs and check availability
    @Query("SELECT s FROM EventSeat s WHERE s.id IN :seatIds AND s.status = :status")
    List<EventSeat> findSeatsByIdsAndStatus(@Param("seatIds") List<Long> seatIds, @Param("status") SeatStatus status);
    
    // Find seats by event, section and status
    @Query("SELECT s FROM EventSeat s WHERE s.event.id = :eventId AND s.section = :section AND s.status = :status")
    List<EventSeat> findSeatsByEventSectionAndStatus(
            @Param("eventId") Long eventId, 
            @Param("section") String section, 
            @Param("status") SeatStatus status);

    // Delete seats by event
    void deleteByEvent(Event event);
} 