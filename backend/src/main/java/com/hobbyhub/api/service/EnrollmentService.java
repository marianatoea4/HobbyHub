package com.hobbyhub.api.service;

import com.hobbyhub.api.model.Enrollment;
import com.hobbyhub.api.model.Event;
import com.hobbyhub.api.model.User;
import com.hobbyhub.api.repository.EnrollmentRepository;
import com.hobbyhub.api.repository.EventRepository;
import com.hobbyhub.api.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Enrollment registerUserToEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu a fost găsit."));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Evenimentul nu a fost găsit."));

        enrollmentRepository.findByUserIdAndEventId(userId, eventId)
                .ifPresent(e -> {
                    throw new RuntimeException("Ești deja înscris (sau în așteptare) la acest eveniment.");
                });

        if (event.getCapacity() <= 0) {
            throw new RuntimeException("Nu mai sunt locuri disponibile.");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setEvent(event);
        enrollment.setStatus("PENDING");

        return enrollmentRepository.save(enrollment);
    }

    @Transactional
    public Enrollment approveEnrollment(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Înscrierea nu există."));

        enrollment.setStatus("CONFIRMED");

        Event event = enrollment.getEvent();
        event.setCapacity(event.getCapacity() - 1);
        eventRepository.save(event);

        return enrollmentRepository.save(enrollment);
    }


    public String getEnrollmentStatus(Long userId, Long eventId) {
        return enrollmentRepository.findByUserIdAndEventId(userId, eventId)
                .map(Enrollment::getStatus)
                .orElse("");
    }


    public List<Enrollment> getEnrollmentsByUser(Long userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    @Transactional
    public void deleteEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Înscrierea nu a fost găsită."));

        if ("CONFIRMED".equals(enrollment.getStatus())) {
            Event event = enrollment.getEvent();
            event.setCapacity(event.getCapacity() + 1);
            eventRepository.save(event);
        }

        enrollmentRepository.deleteById(id);
    }


    public List<Enrollment> getEnrollmentsByEvent(Long eventId) {
        return enrollmentRepository.findByEventId(eventId);
    }


    @Transactional
    public Enrollment rejectEnrollment(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Înscrierea nu există."));

        // Dacă fusese confirmat anterior și acum îl respingem, dăm locul înapoi
        if ("CONFIRMED".equals(enrollment.getStatus())) {
            Event event = enrollment.getEvent();
            event.setCapacity(event.getCapacity() + 1);
            eventRepository.save(event);
        }

        enrollment.setStatus("REJECTED");
        return enrollmentRepository.save(enrollment);
    }
}
