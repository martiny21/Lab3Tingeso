package com.example.demo.repositories;

import com.example.demo.entities.RequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface RequestRepository extends JpaRepository<RequestEntity,Long> {
    @Query(value = "SELECT * FROM requests WHERE requests.user_id = :userId", nativeQuery = true)
    RequestEntity nativeQueryFindByUserId(Long userId);
    RequestEntity findByLoanType(short loanType);
}
