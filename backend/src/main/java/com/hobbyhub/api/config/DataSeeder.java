package com.hobbyhub.api.config;

import com.hobbyhub.api.model.User;
import com.hobbyhub.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Profile("dev")
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User user1 = new User();
                user1.setFirstName("Andrei");
                user1.setLastName("Ionescu");
                user1.setEmail("andrei@hobbyhub.com");
                user1.setPassword(passwordEncoder.encode("parola123"));
                userRepository.save(user1);

                User user2 = new User();
                user2.setFirstName("Maria");
                user2.setLastName("Popescu");
                user2.setEmail("maria@hobbyhub.com");
                user2.setPassword(passwordEncoder.encode("parola123"));
                userRepository.save(user2);

                System.out.println("Baza de date H2 a fost populată cu utilizatori de test.");
            }
        };
    }
}
