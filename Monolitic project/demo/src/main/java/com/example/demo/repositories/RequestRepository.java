package com.example.demo.repositories;

import com.example.demo.entities.RequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface RequestRepository extends JpaRepository<RequestEntity,Long> {
    RequestEntity findByUserId(Long userId);
    RequestEntity findByLoanType(short loanType);
}
