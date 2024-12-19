package com.example.demo.repositories;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.example.demo.entities.UserEntity;
import com.example.demo.services.DocumentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Optional;

class DocumentTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private DocumentRepository documentRepository;

    @InjectMocks
    private DocumentService documentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveDocument_UserExists() throws Exception {
        // Set up a  user ID and test file
        Long userId = 1L;
        String name = "Test Document";
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", "This is a test".getBytes());
        //Simulate the user existing in the repository
        UserEntity user = new UserEntity();
        user.setId(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        //Call the method we want to test
        documentService.saveDocument(file, userId, name);
        //Check if the document is saved and the user is correctly associated
        verify(documentRepository, times(1)).save(argThat(document ->
                document.getName().equals(name) &&
                        document.getPdfData().length > 0 &&
                        document.getUser().getId().equals(userId)
        ));
    }

    @Test
    void testSaveDocument_UserNotFound() {
        //
        Long userId = 1L;
        String name = "Test Document";
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", "This is a test".getBytes());

        //Simulate the user not existing in the repository
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Check that an exception is thrown if the user does not exist
        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            documentService.saveDocument(file, userId, name);
        });

        assertEquals("User not found", thrown.getMessage());
    }
}
