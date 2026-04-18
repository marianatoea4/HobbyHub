package com.hobbyhub.api.repository;

import com.hobbyhub.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends  JpaRepository<User, Long>{
    Optional<User> findByEmail(String email);
}
