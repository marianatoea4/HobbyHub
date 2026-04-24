package com.hobbyhub.api.controller;
import com.hobbyhub.api.model.Event;
import com.hobbyhub.api.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
            // Logica pentru Google Maps API:
            // Frontend-ul va trimite lat și lng în interiorul obiectului 'event'.
            // Aici am putea adăuga o validare suplimentară pentru locație dacă e necesar.

            Event newEvent = eventService.createEvent(event, files);
            return ResponseEntity.ok(newEvent);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare la crearea evenimentului: " + e.getMessage());
        }
    }
}
