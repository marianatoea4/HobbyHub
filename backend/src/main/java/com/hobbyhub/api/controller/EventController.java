package com.hobbyhub.api.controller;
import com.hobbyhub.api.model.Event;
import com.hobbyhub.api.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {
    @Autowired
    private EventService eventService;

    @PostMapping(value = "/create", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createEvent(
            @RequestPart("event") Event event,
            @RequestPart(value = "files", required = false) MultipartFile[] files) {

        try {
            Event newEvent = eventService.createEvent(event, files);
            return ResponseEntity.ok(newEvent);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la crearea evenimentului: " + e.getMessage());
        }
    }

    // metoda pentru preluarea tuturor evenimentelor
    @GetMapping("/all")
    public ResponseEntity<List<Event>> getAllEvents() {
        try {
            List<Event> events = eventService.getAllEvents();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/organizer/{userId}")
    public ResponseEntity<List<Event>> getEventsByOrganizer(@PathVariable Long userId) {
        try {
            List<Event> events = eventService.getEventsByOrganizer(userId);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @RequestPart("event") Event event,
            @RequestPart(value = "files", required = false) MultipartFile[] files) {
        try {
            Event updated = eventService.updateEvent(id, event, files);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la actualizarea evenimentului: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok("Eveniment șters cu succes.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la ștergerea evenimentului: " + e.getMessage());
        }
    }
}
