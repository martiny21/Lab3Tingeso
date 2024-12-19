package com.example.demo.services;

import com.example.demo.entities.DocumentEntity;
import com.example.demo.entities.UserEntity;
import com.example.demo.repositories.DocumentRepository;
import com.example.demo.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class DocumentServiceTest {

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MultipartFile file;

    @InjectMocks
    private DocumentService documentService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSaveDocumentSuccess() throws IOException {
        UserEntity user = new UserEntity();
        user.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(file.getBytes()).thenReturn(new byte[]{1, 2, 3});

        documentService.saveDocument(file, 1L, "testDocument");

        verify(documentRepository, times(1)).save(any(DocumentEntity.class));
    }

    @Test
    public void testSaveDocumentUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            documentService.saveDocument(file, 1L, "testDocument");
        });

        assertEquals("User not found", exception.getMessage());
    }
}
