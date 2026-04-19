package com.hobbyhub.api.controller;

import com.hobbyhub.api.dto.LoginRequest;
import com.hobbyhub.api.dto.RegisterRequest;
import com.hobbyhub.api.model.User;
import com.hobbyhub.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
            user.setPassword(null);
            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {
            if (e.getMessage().equals("EMAIL_NOT_FOUND")) {
                return ResponseEntity.status(404).body("EMAIL_NOT_FOUND");
            } else if (e.getMessage().equals("WRONG_PASSWORD")) {
                return ResponseEntity.status(401).body("WRONG_PASSWORD");
            }
            return ResponseEntity.status(400).body("Eroare necunoscută");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.register(
                    registerRequest.getFirstName(),
                    registerRequest.getLastName(),
                    registerRequest.getEmail(),
                    registerRequest.getPassword()
            );
            user.setPassword(null); // nu trimitem parola inapoi
            return ResponseEntity.status(201).body(user);

        } catch (RuntimeException e) {
            switch (e.getMessage()) {
                case "EMPTY_FIELDS":
                    return ResponseEntity.status(400).body("EMPTY_FIELDS");
                case "INVALID_EMAIL":
                    return ResponseEntity.status(400).body("INVALID_EMAIL");
                case "INVALID_PASSWORD":
                    return ResponseEntity.status(400).body("INVALID_PASSWORD");
                case "EMAIL_ALREADY_EXISTS":
                    return ResponseEntity.status(409).body("EMAIL_ALREADY_EXISTS");
                default:
                    return ResponseEntity.status(400).body("Eroare necunoscută");
            }
        }
    }
}

