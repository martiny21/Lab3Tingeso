package com.example.demo.repositories;

import com.example.demo.entities.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity,Long> {
   
    @Query(value = "SELECT * FROM documents WHERE documents.user_id = :userId", nativeQuery = true)
    ArrayList<DocumentEntity> nativeQueryFindByUserId(Long userId);

    DocumentEntity findByName(String name);
    //Save document to database with params userId, name and
}
