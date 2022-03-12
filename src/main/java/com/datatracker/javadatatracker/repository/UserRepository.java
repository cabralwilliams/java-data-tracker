package com.datatracker.javadatatracker.repository;

import com.datatracker.javadatatracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    //Find user by username
    User findUserByUsername(String username) throws Exception;
    //Find user by email
    User findUserByEmail(String email) throws Exception;
}
