package com.eventmate.server.repository;

import com.eventmate.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA will automatically create a query for us
    // based on this method name: "find by email"
    Optional<User> findByEmail(String email);
}
