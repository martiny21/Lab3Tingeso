package com.example.demo.repositories;

import com.example.demo.entities.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<DocumentEntity,Long> {
    List<DocumentEntity> findByUserId(Long userId);
    DocumentEntity findByName(String name);
    //Save document to database with params userId, name and
}
