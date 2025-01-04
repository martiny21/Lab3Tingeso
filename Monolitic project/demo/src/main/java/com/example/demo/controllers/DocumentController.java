package com.example.demo.controllers;

import com.example.demo.DTO.DocumentDTO;
import com.example.demo.entities.DocumentEntity;
import com.example.demo.services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;


import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/document")
@CrossOrigin("*")
public class DocumentController {

    @Autowired
    DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<DocumentEntity> uploadDocument(@RequestParam("file") MultipartFile file,
                                                         @RequestParam("userId") Long userId,
                                                         @RequestParam("name") String name){
        try {
            documentService.saveDocument(file, userId, name);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /*@GetMapping("/user/{userId}")
    public ResponseEntity<List<DocumentEntity>> getDocumentsByUserId(@PathVariable Long userId) {
        List<DocumentEntity> documents = documentService.getDocumentsByUserId(userId);
        return ResponseEntity.ok(documents);
    }
    */

    // This method is used to get all documents from the database
    @GetMapping("/{userId}")
    public ResponseEntity<List<DocumentEntity>> getUserDocuments(@PathVariable Long userId) {
        return ResponseEntity.ok(documentService.getDocumentsByUserId(userId));
    }

    //To download a document
    @GetMapping("/download/{documentId}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long documentId) {
        DocumentEntity document = documentService.getDocumentById(documentId);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + document.getName() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(document.getPdfData());
    }
}
