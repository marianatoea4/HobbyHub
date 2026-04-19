package com.hobbyhub.api.service;

import com.hobbyhub.api.model.User;
import com.hobbyhub.api.repository.UserRepository;
import com.hobbyhub.api.util.ValidationUtil;
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

    public User register(String firstName, String lastName, String email, String password) {
        // Verificam daca toate campurile sunt completate
        if (firstName == null || firstName.isBlank()
                || lastName == null || lastName.isBlank()
                || email == null || email.isBlank()
                || password == null || password.isBlank()) {
            throw new RuntimeException("EMPTY_FIELDS");
        }

        // Validam formatul email-ului
        if (!ValidationUtil.isValidEmail(email)) {
            throw new RuntimeException("INVALID_EMAIL");
        }

        // Validam complexitatea parolei
        if (!ValidationUtil.isValidPassword(password)) {
            throw new RuntimeException("INVALID_PASSWORD");
        }

        // Verificam daca email-ul exista deja in baza de date
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new RuntimeException("EMAIL_ALREADY_EXISTS");
        }

        // Cream utilizatorul nou cu parola criptata
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        return userRepository.save(user);
    }

    public void changePassword(Long id, String currentPassword, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));

        // Verificăm parola actuală
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("WRONG_PASSWORD");
        }

        // Validăm complexitatea parolei noi
        if (!ValidationUtil.isValidPassword(newPassword)) {
            throw new RuntimeException("INVALID_PASSWORD");
        }

        // Criptăm și salvăm noua parolă
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
