package com.hobbyhub.api.controller;

import com.hobbyhub.api.model.Enrollment;
import com.hobbyhub.api.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:5173")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Long> payload) {
        try {
            Enrollment enrollment = enrollmentService.registerUserToEvent(
                    payload.get("userId"),
                    payload.get("eventId")
            );
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        try {
            Enrollment approved = enrollmentService.approveEnrollment(id);
            return ResponseEntity.ok(approved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/status")
    public ResponseEntity<String> getEnrollmentStatus(
            @RequestParam Long userId,
            @RequestParam Long eventId) {

        String status = enrollmentService.getEnrollmentStatus(userId, eventId);
        return ResponseEntity.ok(status);
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByUser(@PathVariable Long userId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByUser(userId);
        return ResponseEntity.ok(enrollments);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> withdraw(@PathVariable Long id) {
        try {
            enrollmentService.deleteEnrollment(id);
            return ResponseEntity.ok("Te-ai retras cu succes de la eveniment.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Endpoint pentru a vedea cine s-a inscris la un eveniment
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByEvent(@PathVariable Long eventId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByEvent(eventId);
        return ResponseEntity.ok(enrollments);
    }

    // Endpoint pentru a respinge un participant
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        try {
            Enrollment rejected = enrollmentService.rejectEnrollment(id);
            return ResponseEntity.ok(rejected);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
