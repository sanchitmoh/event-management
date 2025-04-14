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

import com.example.bookverse.model.Event;
import com.example.bookverse.model.EventStatus;

import jakarta.persistence.LockModeType;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Find events with pessimistic lock to prevent concurrent updates
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Event e WHERE e.id = :id")
    Optional<Event> findByIdWithLock(@Param("id") Long id);

    // Find events by status
    List<Event> findByStatus(EventStatus status);

    // Find events by category
    List<Event> findByCategory(String category);
    
    // Find upcoming events
    @Query("SELECT e FROM Event e WHERE e.startDate > :now AND e.status = :status AND e.deletedAt IS NULL")
    List<Event> findUpcomingEvents(@Param("now") LocalDateTime now, @Param("status") EventStatus status, Pageable pageable);

    // Find events by category and status
    List<Event> findByCategoryAndStatus(String category, EventStatus status);

    // Search events by name or description
    @Query("SELECT e FROM Event e WHERE e.deletedAt IS NULL AND (LOWER(e.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Event> searchEvents(@Param("query") String query, Pageable pageable);

    // Advanced search with multiple filters
    @Query("SELECT e FROM Event e WHERE e.deletedAt IS NULL " +
           "AND (:query IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:category IS NULL OR e.category = :category) " +
           "AND (:venue IS NULL OR LOWER(e.venue) LIKE LOWER(CONCAT('%', :venue, '%'))) " +
           "AND (:fromDate IS NULL OR e.startDate >= :fromDate) " +
           "AND (:toDate IS NULL OR e.endDate <= :toDate) " +
           "AND (:minPrice IS NULL OR e.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR e.price <= :maxPrice) " +
           "AND (:status IS NULL OR e.status = :status)")
    Page<Event> advancedSearch(
            @Param("query") String query,
            @Param("category") String category,
            @Param("venue") String venue,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("status") EventStatus status,
            Pageable pageable);
} 