package com.example.demo.repositories;

import com.example.demo.entities.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {
    List<TransactionRepository> findBySavingsAccountId(Long savingsAccountId);

    @Override
    <S extends TransactionEntity> S save(S entity);

    @Override
    <S extends TransactionEntity> List<S> saveAll(Iterable<S> entities);
}
