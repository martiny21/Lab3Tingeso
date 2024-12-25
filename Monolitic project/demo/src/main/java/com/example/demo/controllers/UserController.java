package com.example.demo.controllers;

import com.example.demo.entities.UserEntity;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {
    @Autowired
    UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserEntity> registerUser(@RequestBody UserEntity user) {
        try {
            UserEntity newUser = userService.registerUser(user);
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/getByRut")
    public ResponseEntity<UserEntity> getUserByRut(@RequestParam String rut) {
        try {
            UserEntity user = userService.getUserByRut(rut);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{userId}/getRut")
    public String getUserById(@PathVariable Long userId) {
        return userService.getUserRut(userId);
    }

    @PutMapping("/{userId}/validate")
    public ResponseEntity<UserEntity> updateUser(@PathVariable Long userId) {
        try {
            UserEntity updatedUser = userService.updateUser(userId);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
