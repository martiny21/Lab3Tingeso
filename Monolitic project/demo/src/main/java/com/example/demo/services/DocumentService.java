package com.example.demo.services;

import com.example.demo.entities.DocumentEntity;
import com.example.demo.entities.UserEntity;
import com.example.demo.repositories.DocumentRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    @Autowired
    DocumentRepository documentRepository;

    @Autowired
    UserRepository userRepository;

    public void saveDocument(MultipartFile file, Long userId, String name) throws IOException {
        //Check if user exists
        Optional<UserEntity> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            //Create new document, transform MultipartFile to byte array and save to database
            DocumentEntity document = new DocumentEntity();
            document.setName(name);
            document.setPdfData(file.getBytes());
            document.setUser_id(userId); // Set the user

            // Guardar el documento en la base de datos
            documentRepository.save(document);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public ArrayList<DocumentEntity> getDocumentsByUserId(long userId) {
        return documentRepository.nativeQueryFindByUserId(userId);
    }
}
