package com.hobbyhub.api.repository;

import com.hobbyhub.api.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByTargetUserId(Long userId);
    
    @Query("SELECT r FROM Rating r WHERE r.targetEvent.id = :eventId AND r.targetUser IS NULL")
    List<Rating> findByTargetEventIdOnly(Long eventId);
    
    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.targetUser.id = :userId")
    Double getAverageRatingForUser(Long userId);
    
    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.targetEvent.id = :eventId AND r.targetUser IS NULL")
    Double getAverageRatingForEventOnly(Long eventId);

    @Query("SELECT COUNT(r) > 0 FROM Rating r WHERE r.evaluator.id = :evaluatorId AND r.targetEvent.id = :eventId AND r.targetUser IS NULL")
    boolean existsByEvaluatorIdAndTargetEventIdOnly(Long evaluatorId, Long eventId);
    
    boolean existsByEvaluatorIdAndTargetUserIdAndTargetEventId(Long evaluatorId, Long targetUserId, Long targetEventId);
}
