package com.hobbyhub.api.service;

import com.hobbyhub.api.model.User;
import com.hobbyhub.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("EMAIL_NOT_FOUND"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("WRONG_PASSWORD");
        }

        return user;
    }
}
