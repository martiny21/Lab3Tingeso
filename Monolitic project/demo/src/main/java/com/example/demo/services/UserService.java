package com.example.demo.services;

import com.example.demo.entities.UserEntity;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    public UserEntity registerUser(UserEntity user) {
        user.setReady(false);
        return userRepository.save(user);
    }

    public UserEntity getUserByRut(String rut) {
        return userRepository.findByRut(rut);
    }

    public String getUserRut(Long userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getRut();
    }

    public UserEntity updateUser(Long userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setReady(true);
        return userRepository.save(user);
    }
}
