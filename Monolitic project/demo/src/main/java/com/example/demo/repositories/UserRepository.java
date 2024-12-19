package com.example.demo.repositories;

import com.example.demo.entities.DocumentEntity;
import com.example.demo.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    public UserEntity findByRut(String rut);
    List<UserEntity> findByBirthDate(LocalDate birthDate);
    List<UserEntity> findByNameContains(String name);
    @Query(value = "SELECT * FROM users WHERE users.rut = :rut", nativeQuery = true)
    List<UserEntity> findByRutNativeQuery(@Param("rut") String rut);

    @Override
    <S extends UserEntity> S save(S entity);

    UserEntity findByName(String name);
}
