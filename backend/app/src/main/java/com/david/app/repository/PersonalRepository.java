package com.david.app.repository;

import com.david.app.model.Personal;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonalRepository extends MongoRepository<Personal, String> {
    // Métodos personalizados si son necesarios
}