package com.hobbyhub.api.service;
import com.hobbyhub.api.model.Event;
import com.hobbyhub.api.model.EventImage;
import com.hobbyhub.api.repository.EventImageRepository;
import com.hobbyhub.api.repository.EventRepository;
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

    private final String UPLOAD_DIR = "uploads/events/";

    public Event createEvent(Event event, MultipartFile[] files) throws IOException {
        Event savedEvent = eventRepository.save(event);

        if (files != null && files.length > 0) {
            String eventFolder = UPLOAD_DIR + savedEvent.getId() + "/";
            Files.createDirectories(Paths.get(eventFolder));

            for (MultipartFile file : files) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(eventFolder + fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                EventImage image = new EventImage();
                image.setImageUrl("/" + eventFolder + fileName);
                image.setEvent(savedEvent);
                eventImageRepository.save(image);
            }
        }
        return savedEvent;
    }
}
