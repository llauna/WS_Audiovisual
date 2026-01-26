package com.david.app.repository;

import com.david.app.model.Categoria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends MongoRepository<Categoria, String> {
    boolean existsByNombre(String nombre);
    boolean existsByNombreAndIdNot(String nombre, String id);
}
