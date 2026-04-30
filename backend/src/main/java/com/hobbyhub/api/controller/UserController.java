package com.hobbyhub.api.controller;

import com.hobbyhub.api.dto.ChangePasswordRequest;
import com.hobbyhub.api.model.User;
import com.hobbyhub.api.repository.UserRepository;
import com.hobbyhub.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    private final String PROFILE_UPLOAD_DIR = "uploads/profiles/";

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu a fost găsit"));
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu a fost găsit"));

        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());

        // Actualizam bio-ul daca a fost trimis
        if (userDetails.getBio() != null) {
            user.setBio(userDetails.getBio());
        }

        return userRepository.save(user);
    }

    // Endpoint pentru upload poza de profil
    @PostMapping("/{id}/profile-picture")
    public ResponseEntity<?> uploadProfilePicture(
            @PathVariable Long id,
            @RequestPart("file") MultipartFile file) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Utilizatorul nu a fost găsit"));

            // Cream directorul daca nu exista
            String userFolder = PROFILE_UPLOAD_DIR + id + "/";
            Files.createDirectories(Paths.get(userFolder));

            // Salvam fisierul
            String originalName = file.getOriginalFilename();
            if (originalName != null) {
                originalName = originalName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
            }
            String fileName = UUID.randomUUID().toString() + "_" + originalName;
            Path filePath = Paths.get(userFolder + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Salvam calea relativa in baza de date
            String relativeUrl = "/" + userFolder + fileName;
            user.setProfilePicture(relativeUrl);
            userRepository.save(user);

            return ResponseEntity.ok(user);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Eroare la salvarea imaginii: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(id, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
