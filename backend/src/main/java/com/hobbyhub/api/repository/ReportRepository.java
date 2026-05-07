package com.hobbyhub.api.repository;

import com.hobbyhub.api.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    // Toate raportarile facute de un utilizator
    List<Report> findByReporterIdOrderByCreatedAtDesc(Long reporterId);

    // Toate raportarile (pentru un viitor admin panel)
    List<Report> findByStatusOrderByCreatedAtDesc(String status);

    // Verifica daca un utilizator a raportat deja un alt utilizator
    @Query("SELECT COUNT(r) > 0 FROM Report r WHERE r.reporter.id = :reporterId AND r.reportedUser.id = :reportedUserId AND r.reportType = 'USER'")
    boolean existsByReporterAndReportedUser(@Param("reporterId") Long reporterId, @Param("reportedUserId") Long reportedUserId);

    // Verifica daca un utilizator a raportat deja un mesaj
    @Query("SELECT COUNT(r) > 0 FROM Report r WHERE r.reporter.id = :reporterId AND r.reportedMessage.id = :messageId AND r.reportType = 'MESSAGE'")
    boolean existsByReporterAndMessage(@Param("reporterId") Long reporterId, @Param("messageId") Long messageId);

    // Verifica daca un utilizator a raportat deja un eveniment
    @Query("SELECT COUNT(r) > 0 FROM Report r WHERE r.reporter.id = :reporterId AND r.reportedEvent.id = :eventId AND r.reportType = 'EVENT'")
    boolean existsByReporterAndEvent(@Param("reporterId") Long reporterId, @Param("eventId") Long eventId);
}
