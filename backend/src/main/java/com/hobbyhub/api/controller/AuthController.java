package com.hobbyhub.api.controller;

import com.hobbyhub.api.dto.LoginRequest;
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
}
