package com.hobbyhub.api.repository;

import com.hobbyhub.api.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByUserIdAndEventId(Long userId, Long eventId);
    List<Enrollment> findByUserId(Long userId);
}
