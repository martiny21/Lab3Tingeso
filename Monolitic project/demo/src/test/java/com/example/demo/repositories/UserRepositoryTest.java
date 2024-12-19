package com.example.demo.repositories;

import com.example.demo.entities.UserEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSaveUser() {
        // Arrange
        UserEntity user = new UserEntity();
        user.setName("John Doe");
        user.setRut("12345678-9");
        user.setBirthDate(LocalDate.of(1990, 1, 1));
        user.setSalary(50000);
        user.setReady(true);

        // Act
        UserEntity savedUser = userRepository.save(user);

        // Assert
        UserEntity foundUser = entityManager.find(UserEntity.class, savedUser.getId());
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getName()).isEqualTo("John Doe");
        assertThat(foundUser.getRut()).isEqualTo("12345678-9");
    }
}
/*
La cobertura me dice cuanto del codigo fuente esta siendo utilizado
 */
