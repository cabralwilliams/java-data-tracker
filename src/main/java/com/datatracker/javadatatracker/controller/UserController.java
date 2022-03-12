package com.datatracker.javadatatracker.controller;

import com.datatracker.javadatatracker.model.User;
import com.datatracker.javadatatracker.repository.SetRepository;
import com.datatracker.javadatatracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCrypt;

import java.util.List;

@RestController
public class UserController {
    @Autowired
    UserRepository repository;

    @Autowired
    SetRepository datasetRepository;

    @PostMapping("/api/users")
    public User addUser(User user) {
        //Encrypt the password before saving
        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
        repository.save(user);
        return user;
    }

    @GetMapping("/api/users")
    public List<User> getAllUsers() {
        List<User> users = repository.findAll();
        return users;
    }

    @GetMapping("/api/users/{id}")
    public User getUserById(@PathVariable Integer id) {
        User user = repository.getById(id);
        return user;
    }

    @PutMapping("/api/users/{id}")
    public User updateUser(@PathVariable Integer id, User user) {
        // Recover the current user information and save it in variable tempUser
        User tempUser = repository.getById(id);

        //Save the user as long as the tempUser searched for does not equal null, that is, as long
        //as the tempUser exists
        if(!tempUser.equals(null)) {
            //Set the id of the passed in User user to that of tempUser
            user.setId(tempUser.getId());
            //Save user in place of tempUser
            repository.save(user);
        }
        return user;
    }

    @DeleteMapping("/api/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUserById(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}
