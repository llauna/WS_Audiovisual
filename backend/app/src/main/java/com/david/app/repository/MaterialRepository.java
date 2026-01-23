package com.david.app.repository;

import com.david.app.model.Material;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends MongoRepository<Material, String> {
    // Aquí podremos añadir búsquedas personalizadas por categoría más adelante
}