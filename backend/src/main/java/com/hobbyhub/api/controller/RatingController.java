package com.hobbyhub.api.controller;

import com.hobbyhub.api.dto.RatingDTO;
import com.hobbyhub.api.dto.RatingRequest;
import com.hobbyhub.api.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "http://localhost:5173")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping("/event")
    public ResponseEntity<?> rateEvent(@RequestParam Long userId, @RequestBody RatingRequest request) {
        try {
            ratingService.rateEvent(userId, request);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/user")
    public ResponseEntity<?> rateUser(@RequestParam Long userId, @RequestBody RatingRequest request) {
        try {
            ratingService.rateUser(userId, request);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{targetUserId}")
    public List<RatingDTO> getRatingsForUser(@PathVariable Long targetUserId) {
        return ratingService.getRatingsForUser(targetUserId);
    }

    @GetMapping("/event/{targetEventId}")
    public List<RatingDTO> getRatingsForEvent(@PathVariable Long targetEventId) {
        return ratingService.getRatingsForEvent(targetEventId);
    }

    @GetMapping("/user/{targetUserId}/average")
    public Double getAverageUserRating(@PathVariable Long targetUserId) {
        return ratingService.getAverageUserRating(targetUserId);
    }

    @GetMapping("/event/{targetEventId}/average")
    public Double getAverageEventRating(@PathVariable Long targetEventId) {
        return ratingService.getAverageEventRating(targetEventId);
    }
}
