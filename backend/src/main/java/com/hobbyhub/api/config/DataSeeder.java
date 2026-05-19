package com.hobbyhub.api.config;

import com.hobbyhub.api.model.Enrollment;
import com.hobbyhub.api.model.Event;
import com.hobbyhub.api.model.Rating;
import com.hobbyhub.api.model.User;
import com.hobbyhub.api.repository.EnrollmentRepository;
import com.hobbyhub.api.repository.EventRepository;
import com.hobbyhub.api.repository.RatingRepository;
import com.hobbyhub.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@Profile("dev")
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, 
                                   EventRepository eventRepository, 
                                   RatingRepository ratingRepository,
                                   EnrollmentRepository enrollmentRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User user1 = new User();
                user1.setFirstName("Andrei");
                user1.setLastName("Ionescu");
                user1.setEmail("andrei@hobbyhub.com");
                user1.setPassword(passwordEncoder.encode("parola123"));
                user1.setBio("Pasionat de drumeții și fotografie.");
                userRepository.save(user1);

                User user2 = new User();
                user2.setFirstName("Maria");
                user2.setLastName("Popescu");
                user2.setEmail("maria@hobbyhub.com");
                user2.setPassword(passwordEncoder.encode("parola123"));
                user2.setBio("Iubitoare de cărți și cafea bună.");
                userRepository.save(user2);

                User user3 = new User();
                user3.setFirstName("Cristi");
                user3.setLastName("Enache");
                user3.setEmail("cristi@hobbyhub.com");
                user3.setPassword(passwordEncoder.encode("parola123"));
                user3.setBio("Fan sporturi extreme și tehnologie.");
                userRepository.save(user3);

                // Adăugăm un eveniment creat de Andrei
                Event event1 = new Event();
                event1.setTitle("Drumeție la munte - Vf. Omu");
                event1.setDescription("O drumeție relaxantă pentru weekend. Vom pleca din Bușteni.");
                event1.setCategory("Drumeții");
                event1.setDateTime(LocalDateTime.now().plusDays(7));
                event1.setCapacity(10);
                event1.setLat(45.4447);
                event1.setLng(25.4450);
                event1.setCity("Bușteni");
                event1.setStatus("OPEN");
                event1.setOrganizer(user1);
                eventRepository.save(event1);

                // O înscriem pe Maria la evenimentul lui Andrei și o confirmăm direct
                Enrollment enrollment1 = new Enrollment();
                enrollment1.setUser(user2);
                enrollment1.setEvent(event1);
                enrollment1.setStatus("CONFIRMED");
                enrollmentRepository.save(enrollment1);

                // Îl înscriem și pe Cristi ca participant confirmat
                Enrollment enrollment2 = new Enrollment();
                enrollment2.setUser(user3);
                enrollment2.setEvent(event1);
                enrollment2.setStatus("CONFIRMED");
                enrollmentRepository.save(enrollment2);

                // Adăugăm un rating de la Maria pentru Andrei (organizator)
                Rating rating1 = new Rating();
                rating1.setEvaluator(user2);
                rating1.setTargetUser(user1);
                rating1.setScore(5);
                rating1.setComment("Un organizator excelent!");
                ratingRepository.save(rating1);

                // Adăugăm un rating de la Cristi pentru evenimentul lui Andrei
                Rating rating2 = new Rating();
                rating2.setEvaluator(user3);
                rating2.setTargetEvent(event1);
                rating2.setScore(4);
                rating2.setComment("Abia aștept drumeția!");
                ratingRepository.save(rating2);

                System.out.println("Baza de date H2 a fost populată cu utilizatori, evenimente, înscrieri și rating-uri.");
            }
        };
    }
}
