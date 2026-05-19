package com.hobbyhub.api.service;

import com.hobbyhub.api.dto.RatingDTO;
import com.hobbyhub.api.dto.RatingRequest;
import com.hobbyhub.api.model.Event;
import com.hobbyhub.api.model.Rating;
import com.hobbyhub.api.model.User;
import com.hobbyhub.api.repository.EnrollmentRepository;
import com.hobbyhub.api.repository.EventRepository;
import com.hobbyhub.api.repository.RatingRepository;
import com.hobbyhub.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public void rateEvent(Long evaluatorId, RatingRequest request) {
        if (ratingRepository.existsByEvaluatorIdAndTargetEventIdOnly(evaluatorId, request.getTargetEventId())) {
            throw new RuntimeException("You have already rated this event.");
        }

        // Check if user was enrolled
        if (enrollmentRepository.findByUserIdAndEventId(evaluatorId, request.getTargetEventId()).isEmpty()) {
            throw new RuntimeException("You can only rate events you attended.");
        }

        User evaluator = userRepository.findById(evaluatorId).orElseThrow();
        Event event = eventRepository.findById(request.getTargetEventId()).orElseThrow();

        Rating rating = new Rating();
        rating.setEvaluator(evaluator);
        rating.setTargetEvent(event);
        rating.setScore(request.getScore());
        rating.setComment(request.getComment());

        ratingRepository.save(rating);
    }

    public void rateUser(Long evaluatorId, RatingRequest request) {
        if (request.getTargetUserId().equals(evaluatorId)) {
            throw new RuntimeException("You cannot rate yourself.");
        }

        if (ratingRepository.existsByEvaluatorIdAndTargetUserIdAndTargetEventId(evaluatorId, request.getTargetUserId(), request.getTargetEventId())) {
            throw new RuntimeException("You have already rated this user for this event.");
        }

        Event event = eventRepository.findById(request.getTargetEventId()).orElseThrow();

        // Logic: You can rate someone if you both participated in the same event
        // Either you are enrolled, or you are the organizer
        boolean isEnrolled = enrollmentRepository.findByUserIdAndEventId(evaluatorId, request.getTargetEventId()).isPresent();
        boolean isOrganizer = event.getOrganizer() != null && event.getOrganizer().getId().equals(evaluatorId);

        if (!isEnrolled && !isOrganizer) {
            throw new RuntimeException("You must participate in or organize the event to rate others.");
        }

        User evaluator = userRepository.findById(evaluatorId).orElseThrow();
        User targetUser = userRepository.findById(request.getTargetUserId()).orElseThrow();

        Rating rating = new Rating();
        rating.setEvaluator(evaluator);
        rating.setTargetUser(targetUser);
        rating.setTargetEvent(event);
        rating.setScore(request.getScore());
        rating.setComment(request.getComment());

        ratingRepository.save(rating);
    }

    public List<RatingDTO> getRatingsForUser(Long userId) {
        return ratingRepository.findByTargetUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RatingDTO> getRatingsForEvent(Long eventId) {
        return ratingRepository.findByTargetEventIdOnly(eventId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Double getAverageUserRating(Long userId) {
        Double avg = ratingRepository.getAverageRatingForUser(userId);
        return avg != null ? avg : 0.0;
    }

    public Double getAverageEventRating(Long eventId) {
        Double avg = ratingRepository.getAverageRatingForEventOnly(eventId);
        return avg != null ? avg : 0.0;
    }

    private RatingDTO convertToDTO(Rating rating) {
        RatingDTO dto = new RatingDTO();
        dto.setId(rating.getId());
        dto.setEvaluatorId(rating.getEvaluator().getId());
        dto.setEvaluatorName(rating.getEvaluator().getFirstName() + " " + rating.getEvaluator().getLastName());
        dto.setScore(rating.getScore());
        dto.setComment(rating.getComment());
        return dto;
    }
}
