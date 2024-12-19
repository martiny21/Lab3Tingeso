package com.example.demo.services;

import com.example.demo.entities.UserEntity;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRegisterUserSuccess() {
        UserEntity user = new UserEntity();
        user.setName("John Doe");
        user.setRut("12345678-9");

        when(userRepository.save(any(UserEntity.class))).thenReturn(user);

        UserEntity result = userService.registerUser(user);

        assertNotNull(result);
        assertFalse(result.isReady());
        assertEquals("John Doe", result.getName());
    }

    @Test
    public void testGetUserByRutSuccess() {
        UserEntity user = new UserEntity();
        user.setRut("12345678-9");

        when(userRepository.findByRut("12345678-9")).thenReturn(user);

        UserEntity result = userService.getUserByRut("12345678-9");

        assertNotNull(result);
        assertEquals("12345678-9", result.getRut());
    }
}
