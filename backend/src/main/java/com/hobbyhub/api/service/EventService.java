package com.hobbyhub.api.service;
import com.hobbyhub.api.model.Event;
import com.hobbyhub.api.model.EventImage;
import com.hobbyhub.api.repository.EventImageRepository;
import com.hobbyhub.api.repository.EventRepository;
import com.hobbyhub.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Service
public class EventService {
    @Autowired
    EventImageRepository eventImageRepository;

    @Autowired
    EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    private final String UPLOAD_DIR = "uploads/events/";

    public Event createEvent(Event event, MultipartFile[] files) throws IOException {
        if (event.getOrganizer() != null && event.getOrganizer().getId() != null) {
            userRepository.findById(event.getOrganizer().getId())
                    .ifPresent(event::setOrganizer);
        }

        Event savedEvent = eventRepository.save(event);

        if (files != null && files.length > 0) {
            String eventFolder = UPLOAD_DIR + savedEvent.getId() + "/";
            Files.createDirectories(Paths.get(eventFolder));

            for (MultipartFile file : files) {
                //String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                String originalName = file.getOriginalFilename();
                if (originalName != null) {
                    // Înlocuiește spațiile și caracterele dubioase cu underscore "_"
                    originalName = originalName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
                }
                String fileName = UUID.randomUUID().toString() + "_" + originalName;
                Path filePath = Paths.get(eventFolder + fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // Salvez path-ul relativ care va fi servit de WebConfig
                //String relativeImageUrl = "/uploads/" + savedEvent.getId() + "/" + fileName;
                String relativeImageUrl = "/" + UPLOAD_DIR + savedEvent.getId() + "/" + fileName;

                EventImage image = new EventImage();
                image.setImageUrl(relativeImageUrl);
                image.setEvent(savedEvent);
                eventImageRepository.save(image);
                
                System.out.println("Imagine salvată: " + relativeImageUrl);
            }
        }
        return savedEvent;
    }

    // metoda pentru a prelua toate evenimentele din baza de date
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getEventsByOrganizer(Long userId) {
        return eventRepository.findByOrganizerId(userId);
    }
}
